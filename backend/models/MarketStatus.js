const mongoose = require('mongoose');

const MarketStatusModel = new mongoose.Schema({

    marketStatus: {
        type: Object
    }
},{
    timestamps : true
})


module.exports = mongoose.model('MarketStatus', MarketStatusModel)

