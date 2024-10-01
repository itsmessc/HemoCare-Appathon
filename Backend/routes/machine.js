const express = require('express');
const { addmachine, getmachines,startmachine } = require('../actions/machine');
const router = express.Router();


router.post('/addmachine',addmachine);

router.get('/getdetails',getmachines);

router.post('/startmachine',startmachine);

module.exports=router