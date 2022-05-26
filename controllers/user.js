const handleSuccess = require('../service/handleSuccess'); 
const appError = require('../service/appError');
const User = require('../models/userModel');

const users = {
  async getUser(req, res, next) {
    const allUsers = await User.find();
    handleSuccess(res, '取得成功', allUsers);
  },
  async createdUsers(req, res, next) {
    try {
      const data = req.body;
      if (data.email !== '') {
        const newUsers = await User.create({
          name: data.name,
          email: data.email,
          password: data.password,
          photo: data.photo
        })
        handleSuccess(res, '新增成功', newUsers);
      } else {
        appError(400, 'content 欄位未填寫', next);
      }
    } catch (error) {
      appError(400, error.message, next);
    }
  },
  async deleteAll(req, res, next) {
    // 取出 req 的 Url，再判斷是否等於 '/api/users/'
    if (req.originalUrl == '/api/users/') {
      appError(400, '刪除失敗，查無此 ID', next);
    } else {
      await User.deleteMany({});
      const deleteAll = await User.find();
      handleSuccess(res, '刪除成功', deleteAll);
    }
  },
  async deleteSingle(req, res, next) {
    try {
      const id = req.params.id;
      const deleteSingle = await User.findByIdAndDelete(id);
      if (deleteSingle) {
        const user = await User.find();
        handleSuccess(res, '刪除成功', user);
      } else {
        appError(400, '刪除失敗，查無此 ID', next);
      }
    } catch (error) {
      appError(400, error.message, next);
    }
  },
  async updateUsers(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      if (!data.email) {
        return appError(400, 'email 欄位未填寫', next);
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
        return appError(400, '更新失敗，查無此 ID', next);
      }
      const user = await User.find();
      handleSuccess(res, '更新成功', user);
    } catch (error) {
      appError(400, "欄位沒有正確，或沒有此 ID", next);
    }
  }
}

module.exports = users;