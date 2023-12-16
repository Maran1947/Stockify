const Scrip = require("../../models/Scrip");
const Watchlist = require("../../models/Watchlist");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const fyers = require("fyers-api-v2")

fyers.setAppId(process.env.FYERS_APP_ID);
fyers.setAccessToken(process.env.FYERS_ACCESS_TOKEN);

async function getQuotes(scrip) {
    let quotes = new fyers.quotes()
    let result = await quotes
        .setSymbol(`NSE:${scrip}-EQ`)
        .getQuotes();
   return result;
}

module.exports.add_script_in_watchlist = async (req, res) => {
    const { userId, scriptId } = req.body;

    try {
        const script = await Scrip.findOne({ _id: ObjectId(scriptId) });

        const stock = await getQuotes(script.symbol);
        console.log(stock);

        stock?.d && await Scrip.findOneAndUpdate({  _id: ObjectId(scriptId) },{
            cmd: stock.d[0].v.cmd,
            changeInPrice: stock.d[0].v.ch,
            percentageChange: stock.d[0].v.chp,
            lastPrice: stock.d[0].v.lp,
            spread: stock.d[0].v.spread,
            ask: stock.d[0].v.ask,
            bid: stock.d[0].v.bid,
            open: stock.d[0].v.open_price,
            high: stock.d[0].v.high_price,
            low: stock.d[0].v.low_price,
            close: stock.d[0].v.prev_close_price,
            volume: stock.d[0].v.volume,
            shortName: stock.d[0].v.short_name,
            exchange: stock.d[0].v.exchange,
            description: stock.d[0].v.description,
            originalName: stock.d[0].v.original_name,
            tt: stock.d[0].v.tt,
        });

        const existingUserScript = await Watchlist.findOne({ userId: userId, scriptId: scriptId });
        if (existingUserScript) return res.status(400).json({ status: 400, message: "This scrip already added to your watchlist" });

        const watchlistScript = new Watchlist({
            userId,
            scriptId: scriptId,
            scriptName: script.scriptName,
            price: 3012
        });
        await watchlistScript.save();
        return res.status(200).json({
            status: 200,
            message: "Script added successfully to watchlist",
            data: watchlistScript
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        })
    }
}

module.exports.get_watchlist_by_userId = async (req, res) => {
    const { userId } = req.query;

    try {
        const userWatchlist = await Watchlist.find({ userId: userId }).populate("scriptId");
        return res.status(200).json({
            status: 200,
            data: userWatchlist
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }

}

module.exports.remove_watchlist_scrip = async (req, res) => {
    try {
        const { watchlistScripId } = req.query;
        if (!watchlistScripId) {
            return res.status(400).json({
                status: 400,
                message: "WatchlistScripId should not be empty/null"   
            })
        }
        await Watchlist.findByIdAndDelete({ _id: ObjectId(watchlistScripId) });
        return res.status(200).json({
            status: 200,
            message: "Watchlist scrip deleted successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });

    }
}