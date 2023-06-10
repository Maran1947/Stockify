const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({

    userId:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        unique:true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    availableFunds: {
        type: Number,
        default: 100000,
        required: true
    },
},{
    timestamps : true
})


module.exports = mongoose.model('User', UserModel)

