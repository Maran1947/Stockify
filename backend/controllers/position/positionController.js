const Position = require("../../models/Position");

module.exports.get_positions_by_userId = async (req, res) => {
    const { userId } = req.query;
    try {
        const positions = await Position.find({ userId: userId })
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
        return res.status(200).json({
            positions: positions
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
            err: err
        });
    }
}