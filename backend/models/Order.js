const mongoose = require('mongoose');

const OrderModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    scripId: {
        type: String,
        required: true,
        ref: 'Scrip'
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isAvgPrice: {
        type: String,
        required: true
    },
    orderType: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    priceType: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
    },
    isExitOrder: {
        type: String,
        default: false
    }
},{
    timestamps : true
})


module.exports = mongoose.model('Order', OrderModel)

