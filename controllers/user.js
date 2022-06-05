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
    // 密碼正確
    if (password !== confirmPassword) {
      return next(appError(400, "密碼不一致", next));
    };
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, "密碼字數低於 8 碼", next));
    };
    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式不正確", next));
    };

    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name
    });
    generateSendJWT(newUser, 201, res);
  },

  // signIn
  async signIn(req, res, next) {
    let { email, password } = req.body;

    if (!email || !password) {
      return next(appError(400, "帳號密碼不可為空", next));
    };

    const user = await User.findOne({ email }).select('+password');
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

    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });

    generateSendJWT(user, 200, res);
  },

  //  getUserProfile
  async getUserProfile(req, res, next) {
    const user = req.user;
    handleSuccess(res, '取得成功', user);
  },

  //  getAllUsers
  async getAllUsers(req, res, next) {
    const allUsers = await User.find();
    handleSuccess(res, '取得成功', allUsers);
  },

  //  updateUserProfile
  async updateUserProfile(req, res, next) {
    const { name, sex, photo } = req.body;
    if (!name) {
      return next(appError(400, "暱稱不能為空白", next));
    };

    const updateProfile = {
      name,
      sex,
      photo
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateProfile, {
      new: true,
      runValidators: true
    });
    handleSuccess(res, '更新成功', user);
  },

  //  deleteAll
  async deleteAll(req, res, next) {
    //  取出 req 的 Url，再判斷是否等於 '/api/users/'
    if (req.originalUrl == '/api/users/') {
      return next(appError(400, '刪除失敗，查無此 ID', next));
    }
    await User.deleteMany({});
    const deleteAll = [];
    handleSuccess(res, '刪除成功', deleteAll);
  },

  //  deleteSingle
  async deleteSingle(req, res, next) {
    const id = req.params.id;
    const deleteSingle = await User.findByIdAndDelete(id);
    if (!deleteSingle) {
      return next(appError(400, '刪除失敗，查無此 ID', next));
    }
    const user = await User.find();
    handleSuccess(res, '刪除成功', user);
  }
}

module.exports = users;