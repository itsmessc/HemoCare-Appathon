const express = require('express');
const router = express.Router();

const { addstaff } = require('../actions/staff');

router.post('/addstaff',addstaff)
module.exports = router;
