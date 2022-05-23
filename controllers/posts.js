const { successHandle, errorHandle } = require('../service/handle');
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
    successHandle(res, '取得成功', allPosts);
  },
  async createdPosts(req, res, next) {
    try {
      const data = req.body;
      if (data.content !== '') {
        const newPost = await Post.create({
          user: data.user,
          tags: data.tags,
          type: data.type,
          content: data.content
        })
        successHandle(res, '新增成功', newPost);
      } else {
        errorHandle(res, '欄位是空的，請填寫');
      }
    } catch (error) {
      errorHandle(res, error.message);
    }
  },
  async deleteAll(req, res, next) {
    // 取出 req 的 Url，再判斷是否等於 '/api/posts/'
    if (req.originalUrl == '/api/posts/') {
      errorHandle(res, '刪除失敗，查無此 ID');
    } else {
      await Post.deleteMany({});
      const deleteAll = await Post.find();
      successHandle(res, '刪除成功', deleteAll);
    }
  },
  async deleteSingle(req, res, next) {
    try {
      const id = req.params.id;
      const deleteSingle = await Post.findByIdAndDelete(id);
      if (deleteSingle) {
        const post = await Post.find();
        successHandle(res, '刪除成功', post);
      } else {
        errorHandle(res, '刪除失敗，查無此 ID');
      }
    } catch (error) {
      errorHandle(res, error.message);
    }
  },
  async patchPosts(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      if (!data.content) {
        return errorHandle(res, '欄位是空的，請填寫');
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
        return errorHandle(res, '更新失敗，查無此 ID');
      }
      const post = await Post.find().populate({
        path: 'user',
        select: 'name photo'
      });
      successHandle(res, '更新成功', post);
    } catch (error) {
      errorHandle(res, "欄位沒有正確，或沒有此 ID");
    }
  }
}

module.exports = posts;