const mongoose = require('mongoose');
// Define a Mongoose Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userID: { type: String, required: true },
    oldWallet: { type: Number, required: true },
    reservedWallet: { type: Number, required: true },
  });
  module.exports = mongoose.model('RetopUpUser', userSchema);