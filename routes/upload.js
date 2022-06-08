var express = require('express');
var router = express.Router();
const UploadControllers = require('../controllers/uploadController');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');
const upload = require('../service/image');

router.post('/upload', isAuth, upload, handleErrorAsync(UploadControllers.uploadImg));

module.exports = router;