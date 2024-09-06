const express = require('express')
const { addappointment, getappointments, cancelappointment } = require('../actions/appointment')
const router = express.Router()

router.post('/addappointment',addappointment)

router.get('/reservations',getappointments)

router.delete('/cancelappointment/:id',cancelappointment)

module.exports=router