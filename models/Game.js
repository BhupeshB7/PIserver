// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  entryFee: Number,
  targetColor: String,
  chosenColor: String,
  targetLetter:String,
  result: String,
  winningAmount: Number,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Game', gameSchema);
