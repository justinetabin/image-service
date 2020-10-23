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
          const { Body, ContentType } = await s3.getObject(filename);
          const { isJpeg, isSupported } = imgResizer.checkSupportFor(filename);
          if (isSupported) {
            var buffer = Body;
            if (w || h || q) {
              if (isJpeg) {
                buffer = await imgResizer.resizeJpeg(Body, w, h, q);
              } else {
                buffer = await imgResizer.resizePng(Body, w, h, q);
              }
            }
            return hapi.response(buffer).type(ContentType);
          } else {
            return hapi.response(Body).type(ContentType);
          }
        } catch (error) {
          console.log(error);
          return Boom.notFound();
        }
      },
    },
  ];
};
