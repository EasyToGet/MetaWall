const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/userModel');
const handleSuccess = require('../service/handleSuccess');
const appError = require('../service/appError');
const { generateSendJWT } = require('../service/auth');

const users = {
  //  signUp
  async signUp(req, res, next) {
    let { email, password, confirmPassword, name } = req.body;
    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return next(appError(400, "欄位未填寫正確！", next));
    };
    // 暱稱至少 2 個字元以上
    if (!validator.isLength(name, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上", next));
    };
    // 密碼正確
    if (password !== confirmPassword) {
      return next(appError(400, "密碼不一致", next));
    };
    // 密碼需至少 8 碼以上，並中英混合
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0
    })) {
      return next(appError(400, "密碼需至少 8 碼以上，並中英混合", next));
    };
    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式不正確", next));
    };
    // email 是否已註冊
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return next(appError(400, "帳號已被註冊，請替換新的 Email!", next));
    };
    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      name,
      email,
      password
    });
    generateSendJWT(newUser, 201, res);
  },

  // signIn
  async signIn(req, res, next) {
    let { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, "帳號或密碼錯誤，請重新輸入！", next));
    };
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(appError(400, "帳號錯誤或尚未註冊", next));
    };
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, "您的密碼不正確", next));
    };
    generateSendJWT(user, 200, res);
  },

  // updatePassword
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return next(appError(400, "密碼不一致！", next));
    }
    // 密碼需至少 8 碼以上，並中英混合
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0
    })) {
      return next(appError(400, "密碼需至少 8 碼以上，並中英混合", next));
    };
    // 密碼加密
    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });
    generateSendJWT(user, 200, res);
  },

  //  getUserProfile
  async getUserProfile(req, res, next) {
    const { id } = req.user;
    const user = await User.findById(id).select('+email');
    handleSuccess(res, 200, user);
  },

  //  getAllUsers
  async getAllUsers(req, res, next) {
    const allUsers = await User.find();
    handleSuccess(res, 200, allUsers);
  },

  //  updateUserProfile
  async updateUserProfile(req, res, next) {
    const { name, sex, photo } = req.body;
    // 暱稱不能為空白
    if (!name) {
      return next(appError(400, "暱稱不能為空白", next));
    };
    // 暱稱至少 2 個字元以上
    if (!validator.isLength(name, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上", next));
    };
    const updateProfile = {
      name,
      sex,
      photo
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateProfile, {
      returnDocument: 'after',
      runValidators: true
    });
    handleSuccess(res, 200, user);
  },

  //  deleteAll
  async deleteAll(req, res, next) {
    //  取出 req 的 Url，再判斷是否等於 '/api/users/'
    if (req.originalUrl == '/api/users/') {
      return next(appError(400, '刪除失敗，查無此 ID', next));
    }
    await User.deleteMany({});
    const deleteAll = [];
    handleSuccess(res, 200, deleteAll);
  },

  //  deleteSingle
  async deleteSingle(req, res, next) {
    const id = req.params.id;
    const deleteSingle = await User.findByIdAndDelete(id);
    if (!deleteSingle) {
      return next(appError(400, '刪除失敗，查無此 ID', next));
    }
    const user = await User.find();
    handleSuccess(res, 200, user);
  }
}

module.exports = users;


// 以陣列方式收集錯誤訊息
// const errorMessageArr = [];
// errorMessageArr.push('xxxxxxxxxx');
// if (errorMessageArr.length > 0) {
//   const errorMessage = errorMessageArr.join('、');
//   return  next(appError(400, errorMessage, next));
// }

