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

  //  getUser
  async getUser(req, res, next) {
    const allUsers = await User.find();
    handleSuccess(res, '取得成功', allUsers);
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
  },

  //  updateUsers
  async updateUsers(req, res, next) {
    const id = req.params.id;
    const data = req.body;
    if (!data.email) {
      return next(appError(400, 'email 欄位未填寫', next));
    }
    const updateUsers = await User.findByIdAndUpdate(id, {
      name: data.name,
      email: data.email,
      password: data.password,
      photo: data.photo
    },
      {
        new: true,
        runValidators: true
      });
    if (!updateUsers) {
      return next(appError(400, '更新失敗，查無此 ID', next));
    }
    const user = await User.find();
    handleSuccess(res, '更新成功', user);
  }
}

module.exports = users;