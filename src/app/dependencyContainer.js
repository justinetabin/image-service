const config = require("../config");
const { S3Client, ImgResizer } = require("../services");
const routes = require("../routes");
const Hapi = require("./hapi");

module.exports = class DependencyContainer {
  constructor() {
    this.s3client = new S3Client(
      config.S3_ACCESS_KEY,
      config.S3_SECRET_KEY,
      config.S3_ENDPOINT,
      config.S3_VERSION,
      config.S3_BUCKET_NAME
    );
    this.imgResizer = new ImgResizer();
    this.routes = routes.map((route) => route(this));
  }

  makeServer() {
    return new Hapi(this.routes, this.s3client);
  }
};
