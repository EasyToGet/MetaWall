const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // 連接到 User collection (userModel.js)
      required: [true, 'user id 未填寫']
    },
    tags: {
      type: String,
      required: [true, '貼文標籤 tags 未填寫']
    },
    type: {
      type: String,
      enum: ['group', 'person'],
      required: [true, '貼文類型 type 未填寫']
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: 0
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;