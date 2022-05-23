const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '貼文姓名未寫']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, '請輸入您的密碼'],
      minlength: 8,
      select: false
    },
    photo: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;