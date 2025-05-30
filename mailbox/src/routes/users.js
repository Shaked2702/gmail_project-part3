//to use the router, we need to import express and create a new router object
const express = require('express')
var router= express.Router()
//import the controller for users
const controller = require('../controllers/users')
router.route('/')
//post is used to create a new user
    .post(controller.createUser)
router.route('/:id')
//get will return the user details using given id 
    .get(controller.getUserById)
//export the router    
module.exports= router