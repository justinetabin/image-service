const { S3 } = require("aws-sdk");
const { required } = require("joi");
const S3Client = require("./s3client");
const ImgResizer = require("./imgresizer");

module.exports = {
  S3Client,
  ImgResizer,
};
