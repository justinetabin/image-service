const config = require("../config");
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

module.exports = class Server {
  constructor(routes, s3client) {
    this.routes = routes;
    this.s3client = s3client;
    this.server = Hapi.server({
      port: config.HAPI_PORT,
      host: config.HAPI_HOST,
    });
    this.serverUri = this.server.info.uri;
  }

  // Routes

  addRoutes() {
    this.routes.forEach((endpoints) => {
      const hapiEndpoints = endpoints.map(this.toHapiRoute);
      this.server.route(hapiEndpoints);
    });
  }

  toHapiRoute(route) {
    var options = {
      tags: route.tags,
      validate: route.validate,
      description: route.description,
    };
    if (route.multipart === true) {
      options["payload"] = {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1024 * 1024 * (route.limit ? route.limit : 10),
      };

      options["plugins"] = {
        "hapi-swagger": {
          responses: {
            400: {
              description: "BadRequest",
            },
          },
          payloadType: "form",
        },
      };
    }
    return {
      method: route.method,
      path: route.path,
      options,
      handler: async (req, h) => {
        return route.handler({
          params: req.params,
          query: req.query,
          payload: req.payload,
          headers: req.headers,
          hapi: h,
        });
      },
    };
  }

  // Swagger

  addSwagger() {
    return this.server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: config.SWAGGER_DOC_TITLE,
            version: config.SWAGGER_DOC_VERSION,
          },
          pathPrefixSize: config.SWAGGER_PATH_PREFIX_SIZE,
          schemes: config.SWAGGER_SCHEMES,
        },
      },
    ]);
  }

  // Lifecycle

  async preRun() {
    console.log("Checking health of S3 ...");
    await this.s3client.getOrCreateBucket(config.S3_BUCKET_NAME);

    console.log("Adding routes ...");
    await this.addRoutes();

    config.NODE_ENV === "development"
      ? await (() => {
          console.log(
            `Serving Swagger Docs on ${this.serverUri}/documentation`
          );
          return this.addSwagger();
        })()
      : null;
  }

  async runServer() {
    await this.server.start();
    console.log("Server running on %s", this.serverUri);
  }

  async postRun(err) {
    console.log("Stopping server on %s", this.serverUri);
    console.log("Error: %s", err);
    await this.server.stop();
  }
};
