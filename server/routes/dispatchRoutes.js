const express = require('express');
const router = express.Router();
const dispatchController = require('../controllers/dispatchController');

// Bulk create dispatches
router.post('/dispatches/bulk', dispatchController.createDispatchesBulk);
// Get all dispatches
router.get('/dispatches', dispatchController.getDispatches);
// Get a single dispatch by ID
router.get('/dispatches/:id', dispatchController.getDispatchById);
// Update a dispatch
router.put('/dispatches/:id', dispatchController.updateDispatch);
// Delete a dispatch
router.delete('/dispatches/:id', dispatchController.deleteDispatch);

module.exports = router; 