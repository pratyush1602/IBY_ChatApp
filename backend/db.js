const mongoose = require('mongoose');
require('dotenv').config()

const mongoURI = process.env.MongoURL;
const connectTomongo = async ()=>{
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB successfully");
}

module.exports = connectTomongo