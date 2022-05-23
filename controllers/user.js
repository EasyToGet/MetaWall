const { successHandle, errorHandle } = require('../service/handle');
const User = require('../models/userModel');

const users = {
  async getUser(req, res, next) {
    const allUsers = await User.find();
    successHandle(res, '取得成功', allUsers);
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
        successHandle(res, '新增成功', newUsers);
      } else {
        errorHandle(res, '欄位是空的，請填寫');
      }
    } catch (error) {
      errorHandle(res, error.message);
    }
  },
  async deleteAll(req, res, next) {
    // 取出 req 的 Url，再判斷是否等於 '/users/'
    if (req.originalUrl == '/users/') {
      errorHandle(res, '刪除失敗，查無此 ID');
    } else {
      await User.deleteMany({});
      const deleteAll = await User.find();
      successHandle(res, '刪除成功', deleteAll);
    }
  },
  async deleteSingle(req, res, next) {
    try {
      const id = req.params.id;
      const deleteSingle = await User.findByIdAndDelete(id);
      if (deleteSingle) {
        const user = await User.find();
        successHandle(res, '刪除成功', user);
      } else {
        errorHandle(res, '刪除失敗，查無此 ID');
      }
    } catch (error) {
      errorHandle(res, error.message);
    }
  },
  async updateUsers(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      if (!data.email) {
        return errorHandle(res, '欄位是空的，請填寫');
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
        return errorHandle(res, '更新失敗，查無此 ID');
      }
      const user = await User.find();
      successHandle(res, '更新成功', user);
    } catch (error) {
      errorHandle(res, "欄位沒有正確，或沒有此 ID");
    }
  }
}

module.exports = users;