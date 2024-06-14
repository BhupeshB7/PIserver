// models/UserRequest.js
const mongoose = require('mongoose');

const gamerRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId:{
    type: String,
    required: true,
  },
  UPI:{
    type: String,
    required: true,
  },
  accountNo:{
    type: String,
    required: true,
  },
  IFSCCODE:{
    type: String,
    required: true,
  },
  approved: {
    type: String, // Change the type to String
    default: 'Pending', // Set the default value to 'Pending'
  },
 
},{timestamps: true});

module.exports = mongoose.model('GamerWithdrawal', gamerRequestSchema);
