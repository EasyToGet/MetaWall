const handleSuccess = require('../service/handleSuccess');
const appError = require('../service/appError');
const User = require('../models/userModel');

const users = {
  //  getUser
  async getUser(req, res, next) {
    const allUsers = await User.find();
    handleSuccess(res, '取得成功', allUsers);
  },

  //  createdUsers
  async createdUsers(req, res, next) {
    const data = req.body;
    if (!data.email) {
      return next(appError(400, 'content 欄位未填寫', next));
    }
    const newUsers = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      photo: data.photo
    })
    handleSuccess(res, '新增成功', newUsers);
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