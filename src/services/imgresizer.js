const sharp = require("sharp");

module.exports = class ImgResizer {
  /**
   *
   * @param {Buffer} buffer
   * @param {number} width
   * @param {number} height
   * @returns {Promise}
   *
   * @example
   * resize(100, 100)
   */
  resize(buffer, width, height, quality) {
    return sharp(buffer)
      .resize(width, height)
      .jpeg({ quality })
      .toBuffer();
  }
};
