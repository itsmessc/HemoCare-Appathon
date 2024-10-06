const express = require('express')
const { addappointment, getappointments, cancelappointment ,updateappointment} = require('../actions/appointment')
const router = express.Router()

router.post('/addappointment',addappointment)
router.post('/update',updateappointment)
router.get('/reservations',getappointments)
router.delete('/cancelappointment/:id',cancelappointment)

module.exports=router