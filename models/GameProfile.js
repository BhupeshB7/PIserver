const mongoose = require("mongoose");

const GameProfileSchema = new mongoose.Schema({
  name: String,
  balance: {
    type: Number,
    default: 0,
  },
  UPI: String,
  totalwin: {
    type: Number,
    default: 0,
  },
  userId: String,
  sponsorId: String,
  levelIncome: {
    type: Number,
    default: 0,
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
  },
  detailsUpdated: { type: Boolean, default: false },
  updateCount: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("GameProfile", GameProfileSchema);
