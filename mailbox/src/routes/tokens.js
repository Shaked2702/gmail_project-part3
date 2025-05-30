//to use the router, we need to import express and create a new router object
const express = require('express')
var router= express.Router()
//import the controller for token
const controller = require('../controllers/tokens')
//home page for the token
router.route('/')
//post is used to check if user already exists or not and create token for the user
    .post(controller.login)
//export the router    
module.exports= router