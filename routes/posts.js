var express = require('express');
var router = express.Router();
const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');

router.get('/posts', handleErrorAsync(PostsControllers.getPosts));

router.post('/posts', handleErrorAsync(PostsControllers.createdPosts));

router.delete('/posts', handleErrorAsync(PostsControllers.deleteAll));

router.delete('/posts/:id', handleErrorAsync(PostsControllers.deleteSingle));

router.patch('/posts/:id', handleErrorAsync(PostsControllers.patchPosts));

module.exports = router;
