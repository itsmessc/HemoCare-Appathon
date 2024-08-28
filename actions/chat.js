const ChatBox = require('../models/chatbox.js')

exports.addchat=(req, res)=>{
    const chat = new ChatBox({
        sender_id: req.body.sender_id,
        receiver_id: req.body.receiver_id,
        timestamp: req.body.timestamp,
        content: req.body.content,
        location: req.body.location
    })
    chat.save().then(data=>{
        res.json(data)
    }).catch(err=>{
        res.json({message: err})
    })
}