const express = require('express')
var router = express.Router()

// Import the controller for mails
const controller = require('../controllers/mails')
router.route('/').post(controller.createMail) // Create a new mail
router.route('/').get(controller.getMailsByUser)  // Get 50 last mails for a user
router.route('/:id').get(controller.getMailById)  // Get a specific mail by ID
router.route('/:id').patch(controller.updateMailById) // Update a specific mail by ID
router.route('/:id').delete(controller.deleteMailById) // Delete a specific mail by ID 
router.route('/search/:query').get(controller.searchMails) // Search mails by query

// Export router
module.exports = router