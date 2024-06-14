const mongoose = require("mongoose");

const threeMinuteColorPredictGameSchema = new mongoose.Schema({
  sessionId: String,
  time: Number,
}, { timestamps: true });

const ThreeMinuteColorPredictGame = mongoose.model("threeMinuteColorPredictGame", threeMinuteColorPredictGameSchema);

module.exports = ThreeMinuteColorPredictGame;
