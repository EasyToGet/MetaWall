var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');

router.post('/users/sign_up', handleErrorAsync(UserController.signUp));

router.post('/users/sign_in', handleErrorAsync(UserController.signIn));

router.post('/users/updatePassword', isAuth, handleErrorAsync(UserController.updatePassword));

router.get('/users/profile', isAuth, handleErrorAsync(UserController.getUserProfile));

router.get('/users', handleErrorAsync(UserController.getAllUsers));

router.patch('/users/profile', isAuth, handleErrorAsync(UserController.updateUserProfile));

router.delete('/users', handleErrorAsync(UserController.deleteAll));

router.delete('/users/:id', handleErrorAsync(UserController.deleteSingle));

module.exports = router;
