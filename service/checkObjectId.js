const mongoose = require('mongoose');
const appError = require('../service/appError');

const checkObjectId = (id, next) => {
  const isObjectId = mongoose.isObjectIdOrHexString(id);
  if (!isObjectId) {
    return next(appError(400, "id格式不正確", next));
  }
}

module.exports = checkObjectId;