const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./db/dbconn.js');
const fyers = require("fyers-api-v2")
const allScripsKey = require('./scripSymbol.json');
const Scrip = require('./models/Scrip.js');
const Order = require('./models/Order.js');
const Watchlist = require('./models/Watchlist.js');

const routes = require('./routes/routes.js');

const WebSocket = require("ws");


const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(routes);

app.get('/', (req, res) => {
  res.send('Welcome to Stockify APIs');
});

server.listen(port, () => console.log(`Server is running at ${port}`));


// fyers.setAppId(process.env.FYERS_APP_ID);
// fyers.setAccessToken(process.env.FYERS_ACCESS_TOKEN);

// WEBSOCKET SERVER 
const WebSocketSever = new WebSocket.Server({ server: server });

// (async () => {
//   try {
//     const scrips = await Scrip.find();

//     let allScrips = ['NSE:SBIN-EQ', 'NSE:UPL-EQ', 'ADANIPORTS'];
//     scrips.map((scrip) => {
//       if (allScrips.length <= 50) allScrips.push(`${scrip.exchange}:${scrip.symbol}-${scrip.scriptType}`)
//     });


//     const reqBody = {
//       symbol: allScripsKey,
//       dataType: 'symbolUpdate'
//     }

//     fyers.fyers_connect(reqBody, async function (data) {
//       const latestData = JSON.parse(data) && JSON.parse(data).d['7208'];

//       latestData?.map(async (stock) => {
//         const updatedScrip = await Scrip.findOneAndUpdate({ originalName: stock.v.original_name }, {
//           cmd: stock.v.cmd,
//           changeInPrice: stock.v.ch,
//           percentageChange: stock.v.chp,
//           lastPrice: parseFloat(stock.v.lp),
//           spread: stock.v.spread,
//           ask: stock.v.ask,
//           bid: stock.v.bid,
//           open: stock.v.open_price,
//           high: stock.v.high_price,
//           low: stock.v.low_price,
//           close: stock.v.prev_close_price,
//           volume: stock.v.volume,
//           shortName: stock.v.short_name,
//           exchange: stock.v.exchange,
//           description: stock.v.description,
//           originalName: stock.v.original_name,
//           tt: stock.v.tt,
//         })

//         const pendingOrders = await Order.find({ orderStatus: 'Pending' }).populate('scripId');
//         pendingOrders.map(async (order) => {
//           if (order.scripId.originalName === stock.v.original_name) {
//             if (order.orderType.toLowerCase() === 'buy') {
//               if(order.isAvgPrice.toLowerCase() === 'less' && order.price >= parseFloat(stock.v.lp)) {
//                 await Order.findOneAndUpdate({ _id: order._id }, { orderStatus: 'Executed' });
//               } else if(order.isAvgPrice.toLowerCase() === 'greater' && order.price <= parseFloat(stock.v.lp)) {
//                 await Order.findOneAndUpdate({ _id: order._id }, { orderStatus: 'Executed' });
//               }
//             }

//             if (order.orderType.toLowerCase() === 'sell') {
//               if(order.isAvgPrice.toLowerCase() === 'less' && order.price >= parseFloat(stock.v.lp)) {
//                 await Order.findOneAndUpdate({ _id: order._id }, { orderStatus: 'Executed' });
//               } else if(order.isAvgPrice.toLowerCase() === 'greater' && order.price <= parseFloat(stock.v.lp)) {
//                 await Order.findOneAndUpdate({ _id: order._id }, { orderStatus: 'Executed' });
//               }
//             }
//           }
//         });
//       });


//       for (const client of WebSocketSever.clients) {
//         if (client.readyState === WebSocket.OPEN) {

//           const userWatchlist = await Watchlist.find({ userId: client.userId?.userId }).populate("scriptId");

//           let resp = {
//             active: WebSocketSever.clients.size,
//             belongs: "fyresConnect",
//             watchlistSize: userWatchlist.length,
//             scrips: userWatchlist
//           }
//           client.send(JSON.stringify(resp))
//         }
//       }

//     });
//   } catch (err) {
//     console.log(err);
//   }
// })()

WebSocketSever.on('connection', function connection(ws, req) {

  ws.on('message', async function message(data, isBinary) {
    const userId = JSON.parse(data.toString())
    console.log("WS: ", userId);

    for await (const client of WebSocketSever.clients) {
      client.userId = userId
      if (client == ws && client.readyState === WebSocket.OPEN) {

        const userWatchlist = await Watchlist.find({ userId: client.userId?.userId }).populate("scriptId");

        let resp = {
          active: WebSocketSever.clients.size,
          belongs: "connection",
          watchlistSize: userWatchlist.length,
          scrips: userWatchlist
        }
        client.send(JSON.stringify(resp))
      }
    }
  });

  ws.on('close', () => console.log('Client has disconnected!'));

});


