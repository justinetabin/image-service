const Joi = require("joi");
const Boom = require("@hapi/boom");
const DependencyContainer = require("../app/dependencyContainer");

/**
 *
 * @param {!DependencyContainer} dependencyContainer
 */
module.exports = (dependencyContainer) => {
  const s3 = dependencyContainer.s3client;
  const imgResizer = dependencyContainer.imgResizer;
  return [
    {
      path: "/{filename*}",
      description: "Description",
      tags: ["api"],
      method: "GET",
      validate: {
        query: Joi.object({
          w: Joi.number().optional(),
          h: Joi.number().optional(),
          q: Joi.number().optional(),
        }),
      },
      handler: async ({ params: { filename }, query: { w, h, q }, hapi }) => {
        try {
          if (new RegExp(/\.(jpe?g)$/i).test(filename)) {
            const { Body, ContentType } = await s3.getObject(filename);
            var buffer = Body;
            if (w || h || q) {
              buffer = await imgResizer.resize(Body, w, h, q);
            }
            return hapi.response(buffer).type(ContentType);
          } else {
            throw null;
          }
        } catch {
          return Boom.notFound();
        }
      },
    },
  ];
};
