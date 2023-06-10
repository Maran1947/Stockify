const mongoose = require('mongoose');

const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 })
.then(() => console.log("Mongodb connected successfully..."))
.catch((err) => console.log(err));

module.exports = mongoose;