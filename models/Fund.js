// server/models/pendingTransfer.js
const mongoose = require('mongoose');

const pendingTransferSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  deduction: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
});

const PendingTransfer = mongoose.model('PendingTransfer', pendingTransferSchema);

module.exports = PendingTransfer;
