const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
    active: Boolean,
});

module.exports = mongoose.model('Button', buttonSchema);
