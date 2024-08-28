const express = require('express')
const { addappointment } = require('../actions/appointment')
const router = express.Router()

router.post('/addappointment',addappointment)

module.exports=router