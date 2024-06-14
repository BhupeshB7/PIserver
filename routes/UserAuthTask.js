const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/current-user', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  res.json(req.user);
});

router.get('/users', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err.message }));
});

// router.patch('/:id/activate', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     user.is_active = true;
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// Activate user
router.patch('/:id/activate', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.is_active = true;
    user.activationTime = new Date();
    await user.save();

    res.json(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Deactivate user
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.is_active = false;
    user.activationTime = null;
    await user.save();

    res.json(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// router.patch('/:id/deactivate', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     user.is_active = false;
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
