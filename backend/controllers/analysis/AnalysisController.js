const axios = require('axios');
const GainersLosers = require('../../models/GainersLosers');
const MarketStatus = require('../../models/MarketStatus');

const GAINERS_URL = 'https://www.nseindia.com/api/live-analysis-variations?index=gainers';
const LOSERS_URL = 'https://www.nseindia.com/api/live-analysis-variations?index=loosers';
const MARKET_STATUS_URL = 'https://www.nseindia.com/api/marketStatus';

module.exports.get_and_save_gainers_loosers = async (req,res) => {
    try {
        const gainersResponse = await fetch(GAINERS_URL); // axios.get(GAINERS_URL);
        const losersResponse = await fetch(LOSERS_URL); // axios.get(LOSERS_URL);
        
        const  gainersData = await gainersResponse.json();
        const  losersData = await losersResponse.json();

        if(gainersResponse.status === 200 && losersResponse.status === 200) {
            
            const glData = await GainersLosers.find();
            if(glData && glData.length > 0) {
                await GainersLosers.findOneAndUpdate({ _id: glData[0]._id },{
                    gainers: gainersData,
                    losers: losersData 
                });
            } else {
                const gainersLosers = new GainersLosers({
                    gainers: gainersData,
                    losers: losersData
                });
                await gainersLosers.save();
            }

            return res.status(200).json({
                message: 'Successfully Saved'
            });
        }

        return res.status(400).json({
            message: 'Bad request'
        });
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }   
}

module.exports.get_and_save_market_status = async (req, res) => {
    try {
        const response = await fetch(MARKET_STATUS_URL) // axios.get(MARKET_STATUS_URL);
        const data = await response.json();
        // console.log(data);
        if(response.status === 200) {
            const marketStatus = await MarketStatus.find();

            if(marketStatus?.length > 0) {
                await MarketStatus.findOneAndUpdate({ _id: marketStatus[0]._id }, {
                    marketStatus: data
                });
            } else {
                const marketStatus = new MarketStatus({
                    marketStatus: data
                });

                await marketStatus.save();
            }

            return  res.status(200).json({
                message: 'Saved successfully',
                marketStatus: data
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
            err: err
        });
    }
}

module.exports.get_market_status = async (req, res) => {
    try {
        const marketStatus = await MarketStatus.find();
        if(marketStatus) {
            return  res.status(200).json({
                marketStatus: marketStatus[0]?.marketStatus
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
            err: err
        });
    }
}

module.exports.get_gainers_loosers = async (req, res) => {
    try {
        const glData = await GainersLosers.find();
        if(glData) {
            return res.status(200).json({
                gainers: glData[0]?.gainers,
                losers: glData[0]?.losers
            });
        } 

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
            err: err
        });
    }
}