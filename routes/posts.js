var express = require('express');
var router = express.Router();
const PostsControllers = require('../controllers/posts');

router.get('/posts', PostsControllers.getPosts);

router.post('/posts', PostsControllers.createdPosts);

router.delete('/posts', PostsControllers.deleteAll);

router.delete('/posts/:id', PostsControllers.deleteSingle);

router.patch('/posts/:id', PostsControllers.patchPosts);

module.exports = router;
