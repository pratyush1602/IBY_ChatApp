const CONV = require('../modles/CONV');

const getConversation = async (currentuserid) => {
    if (currentuserid) {
        const currentuserconversation = await CONV.find({
            '$or': [
                { sender: currentuserid },
                { receiver: currentuserid }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('receiver')
        // console.log(currentuserconversation);
        const conversation = currentuserconversation.map((w) => {
            // console.log(w.messages);
            const countunseenmsg = w.messages.reduce((preve, curr) => {
                const msgbyuserid = curr?.msgbyuserid?.toString();
                // console.log('msgid',msgbyuserid);
                // console.log(currentuserid);
                // console.log("preve value",preve)
                // console.log("msgid ",msgbyuserid);
                // console.log("curr id",currentuserid);
                if (msgbyuserid !== currentuserid ) {
                    return preve + (curr?.seen ? 0 : 1)
                }
                else{
                    return preve
                }
            }, 0)

            return {
                _id: w?._id,
                sender: w?.sender,
                receiver: w?.receiver,
                unseenmsg: countunseenmsg,
                lastmsg: w.messages[w?.messages?.length - 1]
            }
        })
        return conversation;

    } else {
        return [];
    }
}
module.exports = getConversation


