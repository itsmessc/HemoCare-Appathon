const staff = require('../models/staff');
const jwt=require('jsonwebtoken');

const JWT_SECRET_KEY = 'AYUAYU'; 

exports.addstaff = (req, res) => {
    console.log(req.body);

    staff.create({
        name: req.body.name,
        position: req.body.position,
        phone: req.body.phone,
        blood_group: req.body.blood_group,
        password: req.body.password,
    })
    .then(staff => {
        const payload = {
            id: staff._id, 
            name: staff.name,
        };
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '10d' });

        
        res.json({
            status: staff.name + ' registered',
            token: token
        });
    })
    .catch(err => {
        res.status(500).send('Error: ' + err);
    });
};

exports.login=(req,res)=>{
    staff.findOne({
        phone:req.body.phone,
    }).then(staff=>{
            if(staff.password==req.body.password){

            const payload = {
                id: staff._id, 
                name: staff.name,
            };
            const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '10d' });

            
            res.json({
                status: staff.name + ' Logged In',
                token: token
            });
        }else{
            res.status(400).json({error:'Incorrect Password'})
        }
    }).catch(err=>{
        res.status(401).send('Wrong mobile number'+err)
    })
}
