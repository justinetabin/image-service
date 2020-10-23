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
  resizeJpeg(buffer, width, height, quality) {
    return sharp(buffer)
      .resize(width, height)
      .jpeg({ quality })
      .toBuffer();
  }

  resizePng(buffer, width, height, quality) {
    return sharp(buffer)
      .resize(width, height)
      .png({ quality })
      .toBuffer();
  }

  checkSupportFor(filename) {
    return {
      isSupported: new RegExp(/\.(jpe?g|png)$/i).test(filename),
      isJpeg: new RegExp(/\.(jpe?g)$/i).test(filename)
    }
  }
};
