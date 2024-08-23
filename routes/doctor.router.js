const express=require('express')
const { login } = require('../controller/doctor')
const router=express.Router()

router.post('/login',login)

module.exports=router;