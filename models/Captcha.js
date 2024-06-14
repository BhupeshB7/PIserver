// models/Captcha.js

const mongoose = require('mongoose');

const captchaSchema = new mongoose.Schema({
  captcha: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Captcha', captchaSchema);
