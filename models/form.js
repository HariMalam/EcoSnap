const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: String,
    description: String,
    address: String,
    district: String,
    state: String,
    path: String,
    userId: String,
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('formData', imageSchema);
