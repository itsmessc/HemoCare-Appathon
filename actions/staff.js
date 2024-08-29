const staff = require('../models/staff');

exports.addstaff=(req,res)=>{
    console.log(req.body);
    
    staff.create({
        name:req.body.name,
        position:req.body.position,
        phone:req.body.phone,
        blood_group:req.body.blood_group,
        password:req.body.password
    }).then((staff)=>{
        res.json({status:staff.name+'registered'})
    }).catch(err=>{
        res.send('error'+err)
    })
}

