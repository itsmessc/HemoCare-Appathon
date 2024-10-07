const express = require('express')
const { addappointment, getappointments, cancelappointment ,updateappointment,filterapp} = require('../actions/appointment')
const router = express.Router()

router.post('/addappointment',addappointment)
router.post('/update',updateappointment)
router.get('/reservations',getappointments)
router.delete('/cancelappointment/:id',cancelappointment)
router.post('/filter',filterapp)
module.exports=router