const express= require('express')
const router = express.Router()
const Patient= require('../Model/patient.js')
 
router.post('/newpatient',(req,res)=>{
    const {name,dob,gender,phone,patient_history,blood_group}=req.body
    const patient= new Patient({
        name,
        dob,
        gender,
        phone,
        patient_history,
        blood_group
    })
    patient.save()
    .then(()=>{
        res.status(200).json({message:"Successfully added"})
    })
    .catch((err)=>{
        res.status(400).json({message:err.message})
    })
})

module.exports=router