const handleSuccess = require('../service/handleSuccess');
const appError = require('../service/appError');
const Post = require('../models/postModel');

const posts = {
  async getPosts(req, res, next) {
    // asc 遞增 (由小到大，由舊到新): "createdAt" ; desc 遞減 (由大到小、由新到舊): "-createdAt"
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    // new RegExp() 將字串轉成正規表達式，例如: "cool" -> /cool/
    const q = req.query.keyword !== undefined ? { "content": new RegExp(req.query.keyword) } : {};
    const allPosts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    handleSuccess(res, '取得成功', allPosts);
  },
  async createdPosts(req, res, next) {
    try {
      const data = req.body;
      if (data.content == '') {
        return appError(400, 'content 欄位未填寫', next);
      }
      const newPost = await Post.create({
        user: data.user,
        tags: data.tags,
        type: data.type,
        content: data.content
      })
      handleSuccess(res, '新增成功', newPost);
    } catch (error) {
      appError(400, error.message, next);
    }
  },
  async deleteAll(req, res, next) {
    // 取出 req 的 Url，再判斷是否等於 '/api/posts/'
    if (req.originalUrl == '/api/posts/') {
      return appError(400, '刪除失敗，查無此 ID', next);
    }
    await Post.deleteMany({});
    const deleteAll = await Post.find();
    handleSuccess(res, '刪除成功', deleteAll);
  },
  async deleteSingle(req, res, next) {
    try {
      const id = req.params.id;
      const deleteSingle = await Post.findByIdAndDelete(id);
      if (!deleteSingle) {
        return appError(400, '刪除失敗，查無此 ID', next);
      }
      const post = await Post.find();
      handleSuccess(res, '刪除成功', post);
    } catch (error) {
      appError(400, error.message, next);
    }
  },
  async patchPosts(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      if (!data.content) {
        return appError(400, 'content 欄位未填寫', next);
      }
      const patchPosts = await Post.findByIdAndUpdate(id, {
        name: data.name,
        content: data.content,
        tags: data.tags,
        type: data.type
      },
        {
          new: true,
          runValidators: true
        });
      if (!patchPosts) {
        return appError(400, '更新失敗，查無此 ID', next);
      }
      const post = await Post.find().populate({
        path: 'user',
        select: 'name photo'
      });
      handleSuccess(res, '更新成功', post);
    } catch (error) {
      appError(400, "欄位沒有正確，或沒有此 ID", next);
    }
  }
}

module.exports = posts;