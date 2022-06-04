var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user');
const handleErrorAsync = require('../service/handleErrorAsync');

router.post('/users/sign_up', handleErrorAsync(UserController.signUp));

router.post('/users/sign_in', handleErrorAsync(UserController.signIn));

router.get('/users', handleErrorAsync(UserController.getUser));

router.delete('/users', handleErrorAsync(UserController.deleteAll));

router.delete('/users/:id', handleErrorAsync(UserController.deleteSingle));

router.patch('/users/:id', handleErrorAsync(UserController.updateUsers));

module.exports = router;
