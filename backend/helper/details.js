const jwt = require('jsonwebtoken');
const USER = require('../modles/USER');


const details = async (token)=>{
    if (!token) {
        return {
            message: "session out"
        };
    }

    const decode = jwt.verify(token, process.env.JWT_secret);
    // console.log("Decoded token:", decode);
    const user = await USER.findById(decode.user.id);
    // console.log("User from database:", user);
    return user;
}

module.exports = details