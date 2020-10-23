require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV,

  HAPI_PORT: parseInt(process.env.HAPI_PORT),
  HAPI_HOST: process.env.HOST,

  SWAGGER_DOC_TITLE: process.env.SWAGGER_DOC_TITLE,
  SWAGGER_DOC_VERSION: process.env.SWAGGER_DOC_VERSION,
  SWAGGER_SCHEMES: process.env.SWAGGER_SCHEMES.split(","),
  SWAGGER_PATH_PREFIX_SIZE: parseInt(process.env.SWAGGER_PATH_PREFIX_SIZE),

  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_VERSION: process.env.S3_VERSION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME
};
