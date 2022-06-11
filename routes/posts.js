var express = require('express');
var router = express.Router();
const PostsControllers = require('../controllers/postsController');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');


router.get('/posts', isAuth, handleErrorAsync(PostsControllers.getAllPosts));

router.get('/post/:id', isAuth, handleErrorAsync(PostsControllers.getUserPost));

router.post('/post', isAuth, handleErrorAsync(PostsControllers.createdPost));

router.post('/posts/:id/like', isAuth, handleErrorAsync(PostsControllers.addLike));

router.delete('/posts/:id/unlike', isAuth, handleErrorAsync(PostsControllers.unLike));

router.delete('/posts', isAuth, handleErrorAsync(PostsControllers.deleteAll));

router.delete('/post/:id', isAuth, handleErrorAsync(PostsControllers.deleteSingle));

router.patch('/post/:id', isAuth, handleErrorAsync(PostsControllers.patchPost));

module.exports = router;
