const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

exports.Category = mongoose.model('Category', categorySchema);
