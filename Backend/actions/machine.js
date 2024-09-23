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

exports.getmachines=async (req,res)=>{
    try {
        // Fetch all machines
        const machines = await Machine.find().exec();
    
        // Group machines by location
        const groupedMachines = machines.reduce((acc, machine) => {
          const { location } = machine;
          if (!acc[location]) {
            acc[location] = [];
          }
          acc[location].push(machine);
          return acc;
        }, {});
    
        res.json(groupedMachines);
      } catch (error) {
        res.json({"error":error})
      }
}