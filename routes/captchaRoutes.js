// routes/captchaRoutes.js

const express = require('express');
const router = express.Router();
const captchaController = require('../controllers/captchaController');

router.post('/refresh', captchaController.refreshCaptcha);
router.post('/verify', captchaController.verifyCaptcha);

module.exports = router;
