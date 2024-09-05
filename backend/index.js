const express = require('express');

const connectToMongo = require('./db');

connectToMongo();
var cors = require('cors');
require('dotenv').config();


const {app,server} = require('./socket/index')
// const app = express();

app.use(express.json());
app.use(cors({
    origin:process.env.Front_end,
    credentials:true
}));

const PORT = process.env.PORT || 4000

app.get('/',(request,response)=>{
    response.json({
        message:"Server running at "+PORT
    })
})


app.use('/api/auth',require('./routes/auth'))
server.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});