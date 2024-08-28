const express = require('express');
const { addmachine } = require('../actions/machine');
const router = express.Router();


router.post('/addmachine',addmachine);



module.exports=router