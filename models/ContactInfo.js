const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
    email: String,
    mobile: String,
    telegramLink: String,
    whatsAppGroupLink: String,
    whatsAppNumber: String,
});

module.exports = mongoose.model('ContactInfo', buttonSchema);
