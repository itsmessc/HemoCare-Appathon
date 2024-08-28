const Notification = require('../models/notification.js')

exports.notify=(req,res)=>{

    Notification.create({
        recipient_id: req.body.recipient_id,
        type_of_notification: req.body.type_of_notification,
        content: req.body.content,
        timestamp: req.body.timestamp,
        status: req.body.status

    }).then(Notification => {
        res.status(200).json({status: Notification.recipient_id + 'Notification added'})
    }).catch(err => {
        res.send('error: ' + err)
    }
    )
}