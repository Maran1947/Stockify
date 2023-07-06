const Scrip = require("../models/Scrip");
// const Script = require("../models/Scrip");
// const jsonData = require("./NSE_CM.json");
const fs = require('fs');

let data = [];
const map = new Map();

const segment = {
    "10" : "Equity",
}

// const saveTodb = async () => {
//     jsonData.map((item) => {
//         map.set('NSE_10' + "_" + item.symbol_ticker, {
//             price: 0,
//             scriptName: item.symbol_details,
//             scriptToken: item.Fytoken,
//             symbol: item.underlying_scrip_code,
//             exchange: "NSE",
//             segment: "Equity",
//             scriptType: "EQ",
//             scriptKey: 'NSE_10' + "_" + item.symbol_ticker,
//             last_update_price: item.last_update_price,
//             expiry: ""
//         });
//     });

//     for (const value of map.values()) {
//         data.push(value);
//     }
//     console.log(map.size);
//     var jsonContent = JSON.stringify(data);

//     fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
//         if (err) {
//             console.log("An error occured while writing JSON Object to File.");
//             return console.log(err);
//         }

//         console.log("JSON file has been saved.");
//     });
// }

const saveTodb = async () => {
    const scrips = await Scrip.find();
    scrips.map((scrip) => {
        if(scrip.scriptKey.split('_')[2].split('-')[1] === 'EQ') map.set('NSE_10' + "_" + scrip.symbol, scrip.scriptKey.split('_')[2]);
    });

    for (const value of map.values()) {
        data.push(value);
    }
    // console.log(map.size);
    var jsonContent = JSON.stringify(data);

    fs.writeFile("scripSymbol.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });
}

saveTodb();