const mongoose = require("mongoose");

const oneMinuteColorPredictGameSchema = new mongoose.Schema(
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

const oneMinuteGameHistory = mongoose.model(
  "OneMinuteHistory",
  oneMinuteColorPredictGameSchema
);

module.exports = oneMinuteGameHistory;
