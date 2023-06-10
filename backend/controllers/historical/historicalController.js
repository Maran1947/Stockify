const fyers = require("fyers-api-v2")

fyers.setAppId(process.env.FYERS_APP_ID);
fyers.setAccessToken(process.env.FYERS_ACCESS_TOKEN);

module.exports.get_historical_scrip_data = async (req, res) => {
    const { scrip, timeFrame, fromDate, toDate } = req.query;
    try {
        let history = new fyers.history()
        let result = await history.setSymbol(scrip)
            .setResolution(timeFrame)
            .setDateFormat(1)
            .setRangeFrom(fromDate) 
            .setRangeTo(toDate)
            .getHistory()
        return res.status(200).json({
            message: 'success',
            data: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
            err: err
        });
    }
}
