var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');

router.post('/user/sign_up', handleErrorAsync(UserController.signUp));

router.post('/user/sign_in', handleErrorAsync(UserController.signIn));

router.patch('/user/updatePassword', isAuth, handleErrorAsync(UserController.updatePassword));

router.get('/user/profile', isAuth, handleErrorAsync(UserController.getUserProfile));

router.get('/users', isAuth, handleErrorAsync(UserController.getAllUsers));

router.patch('/user/profile', isAuth, handleErrorAsync(UserController.updateUserProfile));

router.get('/users/getLikeList', isAuth, handleErrorAsync(UserController.getLikeList));

router.post('/users/:id/follow', isAuth, handleErrorAsync(UserController.addFollow));

router.delete('/users/:id/unFollow', isAuth, handleErrorAsync(UserController.unFollow));

router.delete('/users', isAuth, handleErrorAsync(UserController.deleteAll));

router.delete('/user/:id', isAuth, handleErrorAsync(UserController.deleteSingle));

module.exports = router;
