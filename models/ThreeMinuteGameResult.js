const mongoose = require("mongoose");

const threeMinuteGameResultSchema = new mongoose.Schema(
  {
    color: String,
    letter: String,
    number: String,
    sessionIds: {
      type: String,
      // unique:true
    },
  },
  { timestamps: true }
);

const ThreeMinuteGameResult = mongoose.model(
  "ThreeMinuteGameResult",
  threeMinuteGameResultSchema
);

module.exports = ThreeMinuteGameResult;
