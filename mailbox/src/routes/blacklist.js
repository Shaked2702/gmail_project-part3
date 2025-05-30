const express = require('express')

var router = express.Router() // New variable of type Router

// Import the controller for blacklist
const controller = require('../controllers/blacklist')

// Route for posting a new blacklisted url
router.route('/').post(controller.addUrl)

// Route for deleting a blacklisted url
router.route('/:id').delete(controller.deleteUrl)

// Export to use from app.js
module.exports = router