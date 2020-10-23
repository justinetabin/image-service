var AWS = require("aws-sdk");

module.exports = class S3Client {
  /**
   *
   * @param {string} accessKey
   * @param {string} secretKey admin
   * @param {string} endpoint http://localhost:9000
   * @param {string} version v4
   * @param {string} bucketName test
   *
   * @example
   * new S3Client("admin", "admin", "http://localhost:9000", "v4", "test")
   */
  constructor(accessKey, secretKey, endpoint, version, bucketName) {
    this.s3 = new AWS.S3({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      endpoint: endpoint,
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: version,
    });
    this.bucketName = bucketName;
  }

  /**
   *
   * @param {string} filename
   * @param {*} data
   * @param {object} metadata
   */
  putObject(filename, data, metadata) {
    const params = {
      Bucket: this.bucketName,
      Key: filename,
      Body: data,
      Metadata: metadata,
      ContentType: metadata["content-type"],
    };

    return new Promise((resolve, reject) => {
      this.s3.putObject(params, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   *
   * @param {string} filename
   *
   * @example
   * getObject("image.jpg")
   */
  getObject(filename) {
    var params = {
      Bucket: this.bucketName,
      Key: filename,
    };
    return new Promise((resolve, reject) => {
      this.s3.getObject(params, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   * 
   * @param {string} filename 
   */
  deleteObject(filename) {
    const params = {
      Bucket: this.bucketName,
      Key: filename,
    };
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   *
   * @param {string} acl
   * Possible acl values include:
   * "private"
   * "public-read"
   * "public-read-write"
   * "authenticated-read"
   *
   * @example
   * createBucket("yourbucketname")
   * createBucket("yourbucketname", "private")
   */
  createBucket(acl = "public-read") {
    var params = {
      Bucket: this.bucketName,
      ACL: acl,
    };
    return new Promise((resolve, reject) => {
      this.s3.createBucket(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  /**
   *
   */
  getBucket() {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if (err) reject(err);
        else {
          const buckets = data.Buckets;
          const index = buckets
            .map((Bucket) => Bucket.Name)
            .indexOf(this.bucketName);
          if (index > -1) {
            resolve(buckets[index]);
          } else {
            reject("Bucket not found");
          }
        }
      });
    });
  }

  /**
   *
   */
  async getOrCreateBucket() {
    var bucket;
    try {
      bucket = await this.getBucket(this.bucketName);
      return bucket;
    } catch (error) {
      console.log("Buckets does not exists");
    }

    if (bucket == null) {
      console.log("Creating buckets");
      return await this.createBucket(this.bucketName);
    }
  }
};
