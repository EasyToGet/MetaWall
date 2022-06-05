var express = require('express');
var router = express.Router();
const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');


router.get('/posts', isAuth, handleErrorAsync(PostsControllers.getAllPosts));

router.get('/posts/:id', isAuth, handleErrorAsync(PostsControllers.getUserPosts));

router.post('/posts', isAuth, handleErrorAsync(PostsControllers.createdPosts));

router.delete('/posts', handleErrorAsync(PostsControllers.deleteAll));

router.delete('/posts/:id', handleErrorAsync(PostsControllers.deleteSingle));

router.patch('/posts/:id', handleErrorAsync(PostsControllers.patchPosts));

module.exports = router;
