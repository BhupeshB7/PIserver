const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  userID: {
    type: String
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  images: [
    {
      public_id: { type: String }, // Store the public_id from Cloudinary
    }
  ],
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Deposit', userSchema);
