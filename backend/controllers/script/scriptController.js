const Scrip = require('../../models/Scrip');

module.exports.add_script = async (req,res) => {
    try {
        const { 
            scriptName,
            price,
            percentageChange,
            percentageType,
            symbol,
            low,
            high,
            open,
            close,
            scriptToken,
            exchange,
            segment,
            scriptType,
        } = req.body;

        const newScrip = new Scrip({
            scriptName,
            price,
            percentageChange,
            percentageType,
            symbol,
            low,
            high,
            open,
            close,
            scriptToken,
            exchange,
            segment,
            scriptType,
            scriptKey: exchange + "_" + symbol 
        });

        // console.log(newScript);

        await newScrip.save();

        return res.status(200).json({
            success: true,
            data : {
                message : 'New script added succesfully!!'
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            messages: err.message
        })
    }
}

module.exports.get_all_script = async (req,res) => {
    try {
        const allScrips = await Scrip.find();
        return res.status(200).json({
            success: true,
            total: allScrips.length,
            data: allScrips
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
}

module.exports.search_script = async (req,res) => {
    const { scriptName } = req.query;
    try {

        const scrips = await Scrip.find({ 
            $or: [
                {scriptName: { $regex: scriptName, $options: "i" }},
                {symbol: { $regex: scriptName, $options: "i" }} 
            ]
        },{ __v: 0, createdAt: 0, updatedAt: 0 });

        return res.status(200).json({
            success: true,
            data: scrips
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}

module.exports.delete_scrips = async (req,res) => {
    try {

        const { scripIds } = req.body;
        await Scrip.deleteMany({ _id: scripIds });
        return res.status(200).json({
            status: 200,
            message: "Scrips deleted successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}

module.exports.update_scrips = async (req,res) => {
    try {
        const { scriptName, symbol, exchange, segment, price, scriptId, scriptKey, scriptType } = req.body;
        const prevScrip = await Script.findOne({ _id: scriptId });
        await Scrip.findOneAndUpdate({ _id: scriptId }, {
            scriptName: scriptName ? scriptName: prevScrip.scriptName,
            symbol: symbol ? symbol : prevScrip.symbol,
            price: price ? price : prevScrip.price,
            segment: segment ? segment : prevScrip.segment,
            exchange: exchange ? exchange : prevScrip.exchange,
            scriptType: scriptType ? scriptType : prevScrip.scriptType,
            scriptKey : scriptKey ? scriptKey : prevScrip.scriptKey
         });
         return res.status(200).json({
            status: 200,
            messge: "Scrip updated successfully"
         });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}