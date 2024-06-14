const mongoose = require("mongoose");

const oneMinuteGameResultSchema = new mongoose.Schema(
  {
    color: String,
    letter: String,
    number: String,
    sessionId: {
      type: String,
      // unique:true
    },
  },
  { timestamps: true }
);

const oneMinuteGameResult = mongoose.model(
  "OneMinuteResult",
  oneMinuteGameResultSchema
);

module.exports = oneMinuteGameResult;
