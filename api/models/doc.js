const mongoose = require('mongoose');

const docSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model('Doc', docSchema);