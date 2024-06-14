const mongoose = require("mongoose");

const minuteColorPredictGameSchema = new mongoose.Schema({
  sessionId: String,
  time: Number,
}, { timestamps: true });

const MinuteColorPredictGame = mongoose.model("MinuteColorPredictGame", minuteColorPredictGameSchema);

module.exports = MinuteColorPredictGame;
