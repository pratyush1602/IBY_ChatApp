const express = require('express')
const { Server } = require('socket.io')
const http = require('http');
const details = require('../helper/details');
const USER = require('../modles/USER');
const CONV = require('../modles/CONV');
const MESS = require('../modles/MESS');
const mongoose = require('mongoose');
const getConversation = require('../helper/getConversation');

const app = express();


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.Front_end,
        credentials: true
    }
});


const onlineuser = new Set();


io.on('connection', async (socket) => {

    console.log("connected user ", socket.id);

    const token = socket.handshake.auth.token
    const user = await details(token);
  
    socket.join(user?._id?.toString())
    onlineuser.add(user?._id?.toString())
    // console.log(user);
    io.emit('onlineuser', Array.from(onlineuser))

    socket.on('message page', async (userId) => {
        console.log('userId', userId);
        const userDetails = await USER.findById(userId).select('-password');
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            online: onlineuser.has(userId)
        }
        socket.emit('message-user', payload);

        const getconversationmessage = await CONV.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ updatedAt: -1 });

        if (getconversationmessage) {
            socket.emit('message', getconversationmessage?.messages || []);
        } else {
            socket.emit('message', []);  // Emit an empty array if no conversation is found
        }

    })



    socket.on('new message', async (data) => {

        let conversation = await CONV.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        })

        if (!conversation) {
            const createconversation = await CONV({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation = await createconversation.save();
        }

        const message = new MESS({
            text: data.text,
            imageurl: data.imageurl,
            videourl: data.videourl,
            msgbyuserid: data?.msgbyuserid,
        })
        const savemessage = await message.save();

        const updateconversation = await CONV.updateOne({ _id: conversation?._id }, {
            "$push": { messages: savemessage?._id }
        })
        const getconversationmessage = await CONV.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 })
        // console.log("getconversationmessage",getconversationmessage);

        // if (data?.receiver === user?._id) {
        //     await MESS.updateMany(
        //         { _id: { "$in": getconversationmessage?.messages.map(msg => msg._id) }, msgbyuserid: data?.sender, seen: false },
        //         { "$set": { seen: true } }
        //     );
        // }

        io.to(data?.sender).emit('message', getconversationmessage?.messages || []);
        io.to(data?.receiver).emit('message', getconversationmessage?.messages || []);
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);
        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver);

    })

    socket.on('sidebar', async (currentuserid) => {
        if (!mongoose.Types.ObjectId.isValid(currentuserid)) {
            console.error('Invalid ObjectId:', currentuserid);
            return;
        }

        const conversation = await getConversation(currentuserid);
        socket.emit('conversation', conversation)

    })

    socket.on('seen', async (msgbyuserid) => {
        let conversation = await CONV.findOne({
            "$or": [
                { sender: user?._id, receiver: msgbyuserid },
                { sender: msgbyuserid, receiver: user?._id }
            ]
        })
        // io.to(msgbyuserid).emit('newMessage', message);
        const conversationmessageid = conversation?.messages || [];
       
            const updatemessages = await MESS.updateMany(
                { _id: { "$in": conversationmessageid }, msgbyuserid: msgbyuserid },
                { "$set": { seen: true } }
            )

            const conversationSender = await getConversation(user?._id?.toString());
            const conversationReceiver = await getConversation(msgbyuserid);
            io.to(user?._id?.toString()).emit('conversation', conversationSender)
            io.to(msgbyuserid).emit('conversation', conversationReceiver);
        
    })
    socket.on('disconnect', () => {
        onlineuser.delete(user?._id.toString());
        console.log('disconnect user ', socket.id);
    })
})

module.exports = {
    app,
    server,
    onlineuser
}