var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user');

router.get('/users', UserController.getUser);

router.post('/users', UserController.createdUsers);

router.delete('/users', UserController.deleteAll);

router.delete('/users/:id', UserController.deleteSingle);

router.patch('/users/:id', UserController.updateUsers);

module.exports = router;
