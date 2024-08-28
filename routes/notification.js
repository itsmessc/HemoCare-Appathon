const express = require('express');
const { notify } = require('../actions/notifications');
const router = express.Router();


router.post('/addNotification',notify)

module.exports=router

