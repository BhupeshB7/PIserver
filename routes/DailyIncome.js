// Assuming you have already set up your Express app and connected to MongoDB

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your User model

// Route to reset daily income for all users
router.put('/dailyIncome/reset', async (req, res) => {
  try {
    // Update all users to set dailyIncome to 0
    await User.updateMany({}, { dailyIncome: 0 });

    res.status(200).json({ message: 'Daily income reset successfully for all users.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset daily income for users.' });
  }
});

module.exports = router;
