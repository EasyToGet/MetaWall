const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');
const handleSuccess = require('../service/handleSuccess');
const appError = require('../service/appError');

const upload = {
  async uploadImg(req, res, next) {
    //  判斷檔案是否存在
    if (!req.files.length) {
      return next(appError(400, "尚未上傳檔案", next));
    }
    //  取得檔案內容，並判斷寬高是否 1:1
    const dimensions = sizeOf(req.files[0].buffer);
    if (dimensions.width !== dimensions.height) {
      return next(appError(400, "圖片長寬不符合 1:1 尺寸。", next));
    };
    //  定義 imgUr 環境資料
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN
    });
    //  上傳至 imgUr 的相簿
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });
    const imgUrl = {
      imgUrl: response.data.link
    }
    handleSuccess(res, 201, imgUrl);
  }
}

module.exports = upload;