const mongoose = require('mongoose');

const WatchlistModel = new mongoose.Schema({
    scriptId: { type: String, required: true, ref: "Scrip" },
    scriptName: { type: String },
    price: { type: Number },
    userId: {
        type: String,
        required: true,
    }
},{
    timestamps : true
})


module.exports = mongoose.model('Watchlist', WatchlistModel)

