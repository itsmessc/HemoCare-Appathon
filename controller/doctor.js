const pool = require("../db");
const jwt=require("jsonwebtoken")

exports.login=async (req,res)=>{
    console.log('Request body:',req.body);
    const query='SELECT * FROM doctor WHERE email=$1 AND password=$2';
    const {email,password}=req.body;
    try{
        const result=await pool.query(query,[email,password]);
        if(result.rows.length===0){
            res.status(400).json({message:"Invalid Credentials"});
        }else{
            const token=jwt.sign({id:result.user_id,role:result.role},'APPathonSec',{expiresIn:'365d'});
            res.status(200).json({message:"Login Successful",token});
        }
    }
    catch(err){
        console.error('Database query error:',err);
        res.status(500).json({message:err.message});
    }
}