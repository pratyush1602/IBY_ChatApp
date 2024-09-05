const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;


const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps :true
})

const USER =  mongoose.model('user',UserSchema);

module.exports = USER;