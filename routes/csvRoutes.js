const express = require('express');
const UploadController = require('../controllers/uploadController');

const router = express.Router();

router.get('/upload', UploadController.uploadCSV);

module.exports = router;