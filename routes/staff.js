const express = require('express');
const router = express.Router();

const { addstaff, login } = require('../actions/staff');

router.post('/addstaff',addstaff)
router.post('/login',login)
module.exports = router;
