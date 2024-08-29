const Patient= require('../models/patient.js')

exports.addpatient=(req,res)=>{
    const {name,dob,gender,phone,patient_history,blood_group}=req.body
    const patient= new Patient({
        name,
        dob,
        gender,
        phone,
        patient_history,
        blood_group,
        nextappointment:{date:null,time:null}
    })
    patient.save()
    .then(()=>{
        res.status(200).json({message:"Successfully added"})
    })
    .catch((err)=>{
        res.status(400).json({message:err.message})
    })
}