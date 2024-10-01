const express= require('express')
const { addpatient, getdetails } = require('../actions/patient')
const router = express.Router()

 
router.post('/newpatient',addpatient)
router.get('/getdetails',getdetails)
module.exports=router