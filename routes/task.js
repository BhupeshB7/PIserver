const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

  // Define API routes for tasks
router.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.post('/tasks', async (req, res) => {
  const { title, videoLink } = req.body;
  const task = new Task({ title, videoLink });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define API route for user's income wallet
router.get('/income-wallet', async (req, res) => {
  try {
    const { userId } = req.params;
    const incomeWallet = await User.findOne({ userId });
    res.status(200).json(incomeWallet);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/wallet',auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.income += 30;
    await user.save();
     res.status(200).json({ message: 'Wallet updated' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Update wallet if task is completed
router.put('/walletUp', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.tasksCompleted > 0) {
      user.wallet += 30;
      await user.save();
      res.json({ message: 'Wallet updated' });
    } else {
      res.json({ message: 'No tasks completed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/resetDailyIncome',async(req,res)=>{
  try {
    await User.updateMany({}, { $set: {dailyIncome:0 } });
    res.json({ message: 'All users DailyIncome updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
  module.exports = router;