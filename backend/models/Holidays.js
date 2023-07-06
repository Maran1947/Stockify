const mongoose = require('mongoose');

const MarketHolidaysModel = new mongoose.Schema({

    tradingHolidays: {
        type: Object
    },
},{
    timestamps : true
})


module.exports = mongoose.model('MarketHolidays', MarketHolidaysModel)

