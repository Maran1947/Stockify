const Order = require("../../models/Order");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Scrip = require("../../models/Scrip");
const Position = require("../../models/Position");
const ObjectId = mongoose.Types.ObjectId;

module.exports.exit_buy_stock = async (req, res) => {
    const { posId, priceType, productType, avgPrice, qty } = req.body;
    try {

        const position = await Position.findOne({ _id: posId })
            .populate([
                {
                    path: 'buyOrderId',
                    populate: {
                        path: 'scripId'
                    }
                },
                {
                    path: 'sellOrderId',
                    populate: {
                        path: 'scripId'
                    }
                }
            ]);

        const stockPrice = position.buyOrderId.scripId.lastPrice;
        const newOrder = new Order({
            userId: position.userId,
            scripId: position.buyOrderId.scripId._id,
            qty: position.buyOrderId.qty,
            price: avgPrice,
            orderType: 'Sell',
            productType: position.buyOrderId.productType,
            priceType: priceType,
            orderStatus: priceType.toLowerCase() === 'market' ? 'Executed' : 'Pending',
            isAvgPrice: avgPrice >= stockPrice ? 'Greater' : 'Less',
            isExitOrder: true
        });

        await newOrder.save();

        if(priceType.toLowerCase() === 'market') {
            const leverage = 5;
            const user = await User.findOne({ _id: position.userId });

            await User.findOneAndUpdate({ _id: position.userId }, {
                availableFunds: user.availableFunds + ((qty * avgPrice) / leverage)
            });

            await Position.findOneAndUpdate({ _id: posId }, {
                sellOrderId: newOrder._id,
                posStatus: 'Closed'
            });
        }

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

module.exports.exit_sell_stock = async (req, res) => {
    const { posId, priceType, productType, avgPrice, qty } = req.body;
    try {
        const position = await Position.findOne({ _id: posId })
        .populate([
            {
                path: 'buyOrderId',
                populate: {
                    path: 'scripId'
                }
            },
            {
                path: 'sellOrderId',
                populate: {
                    path: 'scripId'
                }
            }
        ]);

    const stockPrice = position.sellOrderId.scripId.lastPrice;

    const newOrder = new Order({
        userId: position.userId,
        scripId: position.sellOrderId.scripId._id,
        qty: qty,
        price: avgPrice,
        orderType: 'Buy',
        productType: position.sellOrderId.productType,
        priceType: avgPrice,
        orderStatus: priceType.toLowerCase() === 'market' ? 'Executed' : 'Pending',
        isAvgPrice: avgPrice >= stockPrice ? 'Greater' : 'Less',
        isExitOrder: true
    });

    await newOrder.save();

    if(priceType.toLowerCase() === 'market') {
        const leverage = 5;
        const user = await User.findOne({ _id: position.userId });

        await User.findOneAndUpdate({ _id: position.userId }, {
            availableFunds: user.availableFunds + ((qty * avgPrice) / leverage)
        });

        await Position.findOneAndUpdate({ _id: posId }, {
            buyOrderId: newOrder._id,
            posStatus: 'Closed'
        });
    }

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

