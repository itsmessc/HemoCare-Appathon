const Appointment = require('../models/appointment.js')

exports.addappointment= (req,res)=>{

    Appointment.create({
        patient_id:req.body.patient_id,
        doctor_id:req.body.doctor_id,
        date:req.body.date,
        time:req.body.time,
        status:req.body.status
    }).then(Appointment=>{
        res.status(200).json({status:Appointment.doctor_id+' appointment added'})
    }
    ).catch(err=>{
        res.send('error: '+err)
    })

}