const ChatBox = require('../models/chatbox.js')

exports.addchat=(req, res)=>{
    const chat = new ChatBox({
        sender_id: req.body.sender_id,
        staff:req.body.staff,
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