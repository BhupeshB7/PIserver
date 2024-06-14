// models/Game.js
const mongoose = require('mongoose');

const LiveGameUserData = new mongoose.Schema({
  entryFee: Number,
  choosenNumber: String,
  choosenColor: String,
  choosenLetter:String,
  userId: String,
},{timestamps :true});

module.exports = mongoose.model('LiveGameUser', LiveGameUserData);
