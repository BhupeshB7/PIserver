const express = require("express");
const router = express.Router();
const reTopup = require('../models/ReTopupUser')
// API Endpoint to insert data into the database
router.post('/reTopup', async (req, res) => { 
    try {
      const userData = req.body;
      const newUser = new reTopup(userData);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      // console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  // API Endpoint to get all users from the database
router.get('/reTopup', async (req, res) => {
    try {
      const users = await reTopup.find({});
      res.status(200).json(users);
    } catch (err) {
      // console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/reTopup/:userId', async (req, res) => {
    try {
      const userID = req.params.userId;
      const user = await reTopup.findOne({ userID:userID });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      // console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  module.exports = router;