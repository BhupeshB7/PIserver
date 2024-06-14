const mongoose = require("mongoose");

const threeMinuteColorPredictGameSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    betAmount: {
      type: Number,
      required: true,
    },
    userId:String,
    userChoice: String,
    userChoiceNumber: String,
    userChoiceLetter: String,
  },
  { timestamps: true }
);

const ThreeMinuteHistory = mongoose.model(
  "ThreeMinuteHistory",
  threeMinuteColorPredictGameSchema
);

module.exports = ThreeMinuteHistory;
