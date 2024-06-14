const express = require('express');
const router = express.Router();
const User = require('../models/User');

// API endpoint to handle the transfer
// router.post('/transferTopupWallet', async (req, res) => {
//   const { sourceUserId, targetUserId, amount } = req.body;

//   // Check if the source user exists and has sufficient balance
//   const sourceUser = await User.findOne({ userId: sourceUserId });
//   if (!sourceUser) {
//     return res.status(400).json({ error: 'Source user not found' });
//   }
//   if (sourceUser.topupWallet < amount || amount < 200) {
//     return res.status(400).json({ error: 'Insufficient balance or invalid transfer amount' });
//   }

//   // Check if the target user exists
//   const targetUser = await User.findOne({ userId: targetUserId });
//   if (!targetUser) {
//     return res.status(400).json({ error: 'UserID not found' });
//   }

//   // Update the source user's topupWallet
//   sourceUser.topupWallet -= amount;
//   await sourceUser.save();

//   // Update the target user's topupWallet
//   targetUser.topupWallet += amount;
//   await targetUser.save();

//   res.json({ message: 'Transfer successful' });
// });
const mongoose = require('mongoose');
const TopUpHistory = require('../models/TopUpHistory');
const TopUpHistory1 = require('../models/TopUpHistory1');

router.post('/transferTopupWallet', async (req, res) => {
  const { sourceUserId, targetUserId, amount } = req.body;

  // Check if the source user exists and has sufficient balance
  const sourceUser = await User.findOne({ userId: sourceUserId });
  if (!sourceUser) {
    return res.status(400).json({ error: 'Source user not found' });
  }
  if (sourceUser.topupWallet < amount || amount < 200) {
    return res.status(400).json({ error: 'Insufficient balance or invalid transfer amount' });
  }

  // Check if the target user exists
  const targetUser = await User.findOne({ userId: targetUserId });
  if (!targetUser) {
    return res.status(400).json({ error: 'UserID not found' });
  }

  // Update the source user's topupWallet
  sourceUser.topupWallet -= amount;
  await sourceUser.save();

  // Update the target user's topupWallet
  targetUser.topupWallet += amount;
  await targetUser.save();

  // Create a new TopupHistory record
  const topupHistory = new TopUpHistory({
    name: sourceUser.name,
    userId: sourceUserId,
    targetUserId: targetUserId,
    amount: amount,
  });

  // Save the top-up history record
  await topupHistory.save();

  res.json({ message: 'Transfer successful' });
});

// Modify the route to return just the user's name
router.get('/targetTransfer/name/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ userId });
    if (user) {
      res.json({ name: user.name });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to fetch data based on userID with pagination
router.get('/topupHistory/:userID', async (req, res) => {
  try {
    const userID = req.params.userID;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 10; // Number of records per page

    const totalRecords = await TopUpHistory.countDocuments({ userId: userID });
    const totalPages = Math.ceil(totalRecords / perPage);
    const skip = (page - 1) * perPage;

    const topUpdata = await TopUpHistory.find({ userId: userID })
      .skip(skip)
      .limit(perPage);

    res.json({
      topUpdata,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to fetch data based on userID with pagination
router.get('/topupUser/:userID', async (req, res) => {
  try {
    const userID = req.params.userID;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 10; // Number of records per page

    const totalRecords = await TopUpHistory1.countDocuments({ userId: userID });
    const totalPages = Math.ceil(totalRecords / perPage);
    const skip = (page - 1) * perPage;

    const topUpdata = await TopUpHistory1.find({ userId: userID })
      .skip(skip)
      .limit(perPage);

    res.json({
      topUpdata,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
