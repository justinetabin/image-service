const Joi = require("joi");
const Boom = require("@hapi/boom");
const DependencyContainer = require("../app/dependencyContainer");

/**
 *
 * @param {!DependencyContainer} dependencyContainer
 */
module.exports = (dependencyContainer) => {
  const s3 = dependencyContainer.s3client;
  return [
    {
      path: "/upload",
      description: "Description",
      tags: ["api"],
      method: "POST",
      multipart: true,
      limit: 50,
      validate: {
        payload: Joi.object({
          dirname: Joi.string().optional(),
          file: Joi.any().meta({ swaggerType: "file" }).required(),
        }),
      },
      handler: async ({
        payload: {
          dirname,
          file: {
            hapi: { filename, headers },
            _data,
          },
        },
      }) => {
        if (dirname) {
          filename = `${dirname}/${filename}`;
        }
        return s3.putObject(filename, _data, headers);
      },
    },

    {
      path: "/upload",
      description: "Description",
      tags: ["api"],
      method: "DELETE",
      validate: {
        payload: Joi.object({
          filename: Joi.string(),
        }),
      },
      handler: async ({ payload: { filename } }) => {
        return s3.deleteObject(filename);
      },
    },
  ];
};
