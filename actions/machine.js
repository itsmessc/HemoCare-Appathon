const Machine=require('../models/machine')

exports.addmachine = (req,res)=>{
    const {machine_type,location,status}=req.body
    const machine= new Machine({
        manufacturing_serial_number:req.body.msn,
        machine_type,
        location,
        status
    })
    machine.save()
    .then(()=>{
        res.status(200).json({message:"Successfully added"})
    })
    .catch((err)=>{
        res.status(400).json({message:err.message})
    })
}

exports.getmachines=(req,res)=>{
    Machine.find()
    .then((machines)=>{
        res.status(200).json(machines)
    })
    .catch((err)=>{
        res.status(400).json({message:err.message})
    })
}