const {mongoose} = require('mongoose');

const {Schema} = mongoose;

const CONVschema = new Schema({
    sender:{
        type:Schema.ObjectId,
        required : true,
        ref: 'user'
    },
    receiver:{
        type:Schema.ObjectId,
        required:true,
        ref:'user'
    },
    messages:[
        {
            type:Schema.ObjectId,
            ref : 'message'
        }
    ]
},{
    timestamps :true
})


const CONV = mongoose.model('conv',CONVschema);
module.exports = CONV;