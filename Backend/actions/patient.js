const Patient= require('../models/patient.js')
const Counter = require('../models/counter.js')

const getNextPatientID = async () => {
    const counterName = 'patient_id';
    const result = await Counter.findOneAndUpdate(
        { name: counterName },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    // Return the updated value as the new patient ID
    return result.value;
};


exports.addpatient= async (req,res)=>{
    const {name,dob,gender,phone,patient_history,blood_group}=req.body

    const patient_id = await getNextPatientID();
    console.log("PAtiendID",patient_id);
    
    const patient= new Patient({
        patient_id,
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

exports.getdetails=(req,res)=>{
    Patient.find()
    .then((patients)=>{
        res.status(200).json(patients)
    })
    .catch((err)=>{
        res.status(400).json({message:err.message})
    })
} 