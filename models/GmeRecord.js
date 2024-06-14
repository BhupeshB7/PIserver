// models/UserRequest.js
const mongoose = require('mongoose');

// Define a schema for the results
const resultSchema = new mongoose.Schema({
    userId: String,
    result: String,
    message: String,
    amount: Number,
    session:String,
    choice:String,
    userChoice:String,
  },{timestamps:true});
  
  module.exports = mongoose.model('GameRecordResult', resultSchema);
