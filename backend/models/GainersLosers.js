const mongoose = require('mongoose');

const GainersLosersModel = new mongoose.Schema({

    gainers: {
        type: Array
    },
    losers: {
        type: Array
    }
},{
    timestamps : true
})


module.exports = mongoose.model('GainersLosers', GainersLosersModel)

