const express = require('express')
const { signup } = require('../controller/patient')
const router=express.Router()


router.post('/addpatient',signup)

module.exports=router;