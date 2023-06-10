
const Order = require("../../models/Order");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Scrip = require("../../models/Scrip");
const Position = require("../../models/Position");
const ObjectId = mongoose.Types.ObjectId;

module.exports.buy_stock = async (req, res) => {
    try {
        const {
            stockId,
            orderType,
            priceType,
            productType,
            qty,
            price,
            userId,
            stockPrice
        } = req.body;

        let avgPrice = parseFloat(price);

        let validPrice = (avgPrice * 100) % 5;
        if (validPrice) {
            return res.status(400).json({
                status: 400,
                message: "Invalid price"
            });
        }

        const user = await User.findOne({ _id: ObjectId(userId) });
        let leverage = 5;
        let margin = leverage * user.availableFunds;

        const scrip = await Scrip.findOne({ _id: stockId });
        avgPrice = avgPrice === 0 ? stockPrice : avgPrice;

        const userOrder = new Order({
            userId: userId,
            scripId: stockId,
            qty: qty,
            price: avgPrice,
            orderType: orderType,
            productType: productType,
            priceType: priceType,
            orderStatus: priceType.toLowerCase() === 'market' ? 'Executed' : 'Pending',
            isAvgPrice: avgPrice >= stockPrice ? 'Greater' : 'Less'
        });
        const order = await userOrder.save();

        if (margin < avgPrice * qty) {
            await Order.findOne({ _id: order._id }, { orderStatus: 'Rejected' });
            return res.status(400).json({
                status: 400,
                message: "Insufficient fund"
            });
        }

        await User.findOneAndUpdate({ _id: userId }, {
            availableFunds: user.availableFunds - ((qty * avgPrice) / leverage)
        });

        const newPosition = new Position({
            userId: userId,
            buyOrderId: order._id,
            sellOrderId: order._id,
            qty: qty,
            posStatus: 'Active'
        });

        await newPosition.save();

        return res.status(200).json({
            success: true,
            data: {
                message: 'Buy order placed successfully!!'
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            messages: err.message
        })
    }
}

module.exports.sell_stock = async (req, res) => {
    try {
        const {
            stockId,
            orderType,
            priceType,
            productType,
            qty,
            price,
            userId,
            stockPrice
        } = req.body;

        let avgPrice = parseFloat(price);

        let validPrice = (avgPrice * 100) % 5;
        if (validPrice) {
            return res.status(400).json({
                status: 400,
                message: "Invalid price"
            });
        }

        const user = await User.findOne({ _id: ObjectId(userId) });

        let leverage = 5;
        let margin = leverage * user.availableFunds;
        avgPrice = avgPrice === 0 ? stockPrice : avgPrice;

        const userOrder = new Order({
            userId: userId,
            scripId: stockId,
            qty: qty,
            price: avgPrice,
            orderType: orderType,
            productType: productType,
            priceType: priceType,
            orderStatus: priceType.toLowerCase() === 'market' ? 'Executed' : 'Pending',
            isAvgPrice: avgPrice >= stockPrice ? 'Greater' : 'Less'
        });
        const order = await userOrder.save();

        if (margin < avgPrice * qty) {
            await Order.findOne({ _id: order._id }, { orderStatus: 'Rejected' });
            return res.status(400).json({
                status: 400,
                message: "Insufficient fund"
            });
        }

        await User.findOneAndUpdate({ _id: userId }, {
            availableFunds: user.availableFunds - ((qty * avgPrice) / leverage)
        });

        const newPosition = new Position({
            userId: userId,
            buyOrderId: order._id,
            sellOrderId: order._id,
            qty: qty,
            posStatus: 'Active'
        });

        await newPosition.save();

        return res.status(200).json({
            success: true,
            data: {
                message: 'Sell order placed successfully!!'
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            messages: err.message
        })
    }
}

