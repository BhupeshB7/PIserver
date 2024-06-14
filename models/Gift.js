// models/session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // PI: { type: String, default: 'PI2024000' },
  giftTime: { type: Number, default: 0 },
  code: String,
  amount: Number,
  expirationTime: Date,
});

const GiftCode = mongoose.model('GiftCode', sessionSchema);

module.exports = GiftCode;
