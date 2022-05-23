var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user');

router.get('/', UserController.getUser);

router.post('/', UserController.createdUsers);

router.delete('/', UserController.deleteAll);

router.delete('/:id', UserController.deleteSingle);

router.patch('/:id', UserController.updateUsers);

module.exports = router;
