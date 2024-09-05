const {mongoose} = require('mongoose');

const {Schema} = mongoose;

const MessageSchema = new Schema({
    text:{
        type:String,
        default:""
    },
    imageurl:{
        type:String,
        default:""
    },
    videourl:{
        type:String,
        default:""
    },
    seen:{
        type:Boolean,
        default:false
    },
    msgbyuserid:{
        type:Schema.ObjectId,
        required: true,
        ref : 'user'
    }
},{
    timestamps:true
})


const MESS = mongoose.model('message',MessageSchema);
module.exports = MESS;