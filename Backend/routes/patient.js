const express= require('express')
const { addpatient } = require('../actions/patient')
const router = express.Router()

 
router.post('/newpatient',addpatient)

module.exports=router