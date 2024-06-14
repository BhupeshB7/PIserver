// models/session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: String,
  code: String,
  reward:Number
  //   expirationTime: Date,
});

const GiftReward = mongoose.model("GiftReward", sessionSchema);

module.exports = GiftReward;
