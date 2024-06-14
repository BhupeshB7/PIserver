const express = require('express');
const router = express.Router();
const userTaskController = require('../controllers/userTaskController');

// Route to check if a task is complete for a specific user
router.get('/:taskId/:userId', userTaskController.checkTaskCompletion);

module.exports = router;
