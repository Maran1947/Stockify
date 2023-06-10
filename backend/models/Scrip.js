const mongoose = require('mongoose');

const ScripModel = new mongoose.Schema({
    scriptName: {
        type: String,
        required: true
    },
    lastPrice: {
        type: Number,
    },
    percentageChange: {
        type: Number,
    },
    changeInPrice: {
        type: Number
    },
    symbol: {
        type: String,
    },
    low: {
        type: Number,
    },
    high: {
        type: Number,
    },
    open: {
        type: Number,
    },
    close: {
        type: Number,
    },
    scriptToken: {
        type: Number,
        required: true,
    },
    exchange: {
        type: String,
        required: true
    },
    segment: {
        type: String,
        required: true
    },
    scriptType: {
        type: String,
        required: true,
    },
    scriptKey: {
        type: String,
        required: true,
        unique: true
    },
    last_update_price: {
        type: String,
    },
    cmd: {
        type: Object
    },
    spread: {
        type: String
    },
    ask: {
        type: String
    },
    bid: {
        type: String
    },
    volume: {
        type: Number
    },
    shortName: {
        type: String
    },
    exchange: {
        type: String
    },
    description: {
        type: String
    },
    originalName: {
        type: String
    },
    tt: {
        type: String
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Scrip', ScripModel);

