const Order = require("../../models/Order");
const mongoose = require('mongoose');

module.exports.get_user_orders = async (req, res) => {
    const { userId, status } = req.query;

    try {
        const orders = await Order.find({ 
            userId: userId, 
            orderStatus: status.toLowerCase() === 'open' ? ['Pending'] : ['Executed','Rejected']  
        }).populate('scripId');
        
        return res.status(200).json({
            message: 'success',
            orders: orders
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}