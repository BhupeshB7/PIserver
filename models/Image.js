const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId:String,
    filename: String,
  data: Buffer,
});

module.exports = mongoose.model('Image', imageSchema);
