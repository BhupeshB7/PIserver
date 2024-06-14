
const mongoose = require('mongoose');

const predictLiveSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size:{
    type: String,
    required: true,
  },
},{timestamps:true});

module.exports = mongoose.model('PredictLive', predictLiveSchema);
