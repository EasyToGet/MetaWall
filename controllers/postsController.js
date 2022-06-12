const mongoose = require('mongoose');
const handleSuccess = require('../service/handleSuccess');
const appError = require('../service/appError');
const Post = require('../models/postModel');
const Comment = require('../models/commentsModel');

const posts = {
  //  getAllPosts
  async getAllPosts(req, res, next) {
    // asc 遞增 (由小到大，由舊到新): "createdAt" ; desc 遞減 (由大到小、由新到舊): "-createdAt"
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    // new RegExp() 將字串轉成正規表達式，例如: "cool" -> /cool/
    const q = req.query.keyword !== undefined ? { "content": new RegExp(req.query.keyword) } : {};
    const allPosts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    })
      .populate({
        path: 'comments',
        select: 'comment user'
      }).sort(timeSort);
    handleSuccess(res, 200, allPosts);
  },

  //  getPosts
  async getUserPost(req, res, next) {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return appError(400, "Post ID 格式不正確", next);
    };
    const singlePost = await Post.find({
      _id: id
    }).populate({
      path: 'user',
      select: 'name photo'
    })
      .populate({
        path: 'comments',
        select: 'comment user'
      });
    handleSuccess(res, 200, singlePost);
  },

  //  createdPosts
  async createdPost(req, res, next) {
    const data = req.body;
    if (!data.content || !data.content.trim()) {
      return next(appError(400, 'content 欄位未填寫', next));
    }
    const newPost = await Post.create({
      user: req.user.id,
      content: data.content,
      image: data.image,
      tags: data.tags,
      type: data.type,
    })
    handleSuccess(res, 200, newPost);
  },

  //  addLike
  async addLike(req, res, next) {
    const _id = req.params.id;
    const userId = req.user.id;
    await Post.findOneAndUpdate(
      { _id },
      { $addToSet: { likes: userId } },
      { new: true }
    );
    const addLike = {
      postId: _id,
      userId: userId
    }
    handleSuccess(res, 201, addLike);
  },

  //  unLike
  async unLike(req, res, next) {
    const _id = req.params.id;
    const userId = req.user.id;
    await Post.findOneAndUpdate(
      { _id },
      { $pull: { likes: userId } },
      { new: true }
    );
    const unLike = {
      postId: _id,
      userId: userId
    }
    handleSuccess(res, 201, unLike);
  },

  //  addComment
  async addComment(req, res, next) {
    const user = req.user.id;
    const post = req.params.id;
    const { comment } = req.body;
    //  檢查 Post ID 格式
    if (!mongoose.isValidObjectId(post)) {
      return appError(400, "Post ID 格式不正確", next);
    };

    //  檢查 Post ID  
    const findPostId = await Post.findById(post);
    if (findPostId === null) {
      return next(appError(400, "留言文章不存在", next));
    };
    const newComment = await Comment.create({
      post,
      user,
      comment
    });
    const addComments = {
      comments: newComment
    };
    handleSuccess(res, 201, addComments);
  },

  //  getUserComment
  async getUserComment(req, res, next) {
    const userId = req.params.id;
    const posts = await Post.find({ userId }).populate({
      path: 'comments',
      select: 'comment user'
    });
    req.status(200).send({
      status: 'success',
      results: posts.length,
      posts
    });
  },

  //  deleteAll
  async deleteAll(req, res, next) {
    //  取出 req 的 Url，再判斷是否等於 '/api/posts/'
    if (req.originalUrl == '/api/posts/') {
      return next(appError(400, '刪除失敗，查無此 ID', next));
    }
    await Post.deleteMany({});
    const deleteAll = [];
    handleSuccess(res, 200, deleteAll);
  },

  //  deleteSingle
  async deleteSingle(req, res, next) {
    const id = req.params.id;
    const deleteSingle = await Post.findByIdAndDelete(id);
    if (!deleteSingle) {
      return next(appError(400, '刪除失敗，查無此 ID', next));
    }
    const post = await Post.find();
    handleSuccess(res, 200, post);
  },

  //  patchPosts
  async patchPost(req, res, next) {
    const id = req.params.id;
    const data = req.body;
    if (!data.content || !data.content.trim()) {
      return next(appError(400, 'content 欄位未填寫', next));
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
      return next(appError(400, '更新失敗，查無此 ID', next));
    }
    const post = await Post.find().populate({
      path: 'user',
      select: 'name photo'
    });
    handleSuccess(res, 200, post);
  }
}

module.exports = posts;