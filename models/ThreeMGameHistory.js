const mongoose = require("mongoose");

const threeMinuteGameRecordSchema = new mongoose.Schema(
  {
    userId:String,
    sessionId: {
      type: String,
      required: true,
    },
    betAmount: {
      type: Number,
      required: true,
    },
    userChoice:String,
    winningChoice:String,
    result:String,
  },
  { timestamps: true }
);

const threeMinuteGameRecord = mongoose.model(
  "THreeMinuteGameRecord",
  threeMinuteGameRecordSchema
);

module.exports = threeMinuteGameRecord;
