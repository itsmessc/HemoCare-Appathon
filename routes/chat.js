const express = require('express')
const { addchat } = require('../actions/chat')
const router = express.Router()


router.post('/chat', addchat)

module.exports=router