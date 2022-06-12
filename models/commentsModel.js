const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, '請輸入留言內容']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '請輸入 User ID']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, '請輸入 Post ID']
    }
  },
);

// mongoose 前置器 pre hook, 有用到 find 開頭語法時觸發
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: 'name id createdAt'
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;