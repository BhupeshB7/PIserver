// Import necessary modules and set up your Express app
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Your user model

// Route for changing the password
router.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword, confirmPassword } = req.body; // Include userId in the request body
  // const userId = req.user._id; // Assuming you have authentication middleware

  try {
    const user = await User.findOne({userId: userId});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Update the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
