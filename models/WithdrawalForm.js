const mongoose = require('mongoose');

const WithdrawalAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameProfile', // Reference to the GameProfile model
    required: true,
  },
  accountNo: {
    type: String,
    default: '0',
  },
  ifscCode: {
    type: String,
    default: '0',
  },
  GPay: {
    type: String,
    default: '0',
  },
  accountHolderName: {
    type: String,
    default:'Please enter your Name',
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('WithdrawalUserAccountForm', WithdrawalAccountSchema);
