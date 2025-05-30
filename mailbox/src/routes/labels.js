const express = require('express')
var router = express.Router()

// Import the controller for labels
const controller = require('../controllers/labels')
router.route('/').post(controller.createLabel) // For a specific user
router.route('/').get(controller.getLabelsByUser)  // Get all labels for a user
router.route('/:id').get(controller.getLabelById)  // Get a specific label by ID (still belongs to a user)
router.route('/:id').patch(controller.updateLabelById) // Update a specific label by ID (still belongs to a user)
router.route('/:id').delete(controller.deleteLabelById) // Delete a specific label by ID (still belongs to a user)

// Export router
module.exports = router