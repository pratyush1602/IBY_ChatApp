var jwt = require('jsonwebtoken');  // for giving the auth token to client

const JWT_secret = process.env.JWT_secret;

const fetchuser=(req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "please authenticate using valid token"});
    }
    try {
        const data = jwt.verify(token,JWT_secret);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "please authenticate using valid token"});
       
    }
}
module.exports = fetchuser;
