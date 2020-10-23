const Joi = require("joi");
const Boom = require("@hapi/boom");
const DependencyContainer = require("../app/dependencyContainer");

/**
 *
 * @param {!DependencyContainer} dependencyContainer
 */
module.exports = (dependencyContainer) => {
  return [
    {
      path: "/foo",
      description: "Description",
      tags: ["api"],
      method: "GET",
      validate: {},
      handler: async () => {
        return "Hello World";
      },
    },

    {
      path: "/foo/boom",
      description: "Description",
      tags: ["api"],
      method: "GET",
      validate: {},
      handler: async () => {
        return Boom.badRequest();
      },
    },

    {
      path: "/foo/{slug}",
      description: "Description",
      method: "GET",
      tags: ["api"],
      validate: {
        params: Joi.object({
          slug: Joi.string(),
        }),
        query: Joi.object({
          name: Joi.string().optional(),
        }),
      },
      handler: async ({ params: { slug }, query: { name } }) => {
        return `${slug} ${name}`;
      },
    },

    {
      path: "/foo",
      description: "Description",
      tags: ["api"],
      method: "POST",
      multipart: true,
      limit: 50,
      validate: {
        payload: Joi.object({
          file: Joi.any().meta({ swaggerType: "file" }).required(),
          bar: Joi.string().required(),
        }),
      },
      handler: async ({
        payload: {
          file: {
            hapi: { filename },
          },
          bar,
        },
      }) => {
        return `Hello ${bar}, got filename ${filename}`;
      },
    },

    {
      path: "/foo/{slug}",
      description: "Description",
      tags: ["api"],
      method: "PUT",
      validate: {
        params: Joi.object({
          slug: Joi.string(),
        }),
      },
      handler: async ({ params: { slug } }) => {
        return `Hello ${slug}`;
      },
    },

    {
      path: "/foo/{slug}",
      description: "Description",
      tags: ["api"],
      method: "DELETE",
      validate: {
        params: Joi.object({
          slug: Joi.string(),
        }),
      },
      handler: async ({ params: { slug } }) => {
        return `Hello ${slug}`;
      },
    },
  ];
};
