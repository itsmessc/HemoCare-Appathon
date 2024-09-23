const express = require('express');
const { addmachine, getmachines } = require('../actions/machine');
const router = express.Router();


router.post('/addmachine',addmachine);

router.get('/getdetails',getmachines);

module.exports=router