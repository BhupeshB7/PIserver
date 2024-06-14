const mongoose = require("mongoose");

const oneMinuteGameRecordSchema = new mongoose.Schema(
  {userId:String,
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

const oneMinuteGameRecord = mongoose.model(
  "OneMinuteGameRecord",
  oneMinuteGameRecordSchema
);

module.exports = oneMinuteGameRecord;
