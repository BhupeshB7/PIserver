// routes/session.js
const express = require('express');
const Session = require('../models/Gift');
const cron = require('node-cron');
const GiftReward = require('../models/GiftReward');
const GameProfile = require('../models/GameProfile');
const User = require('../models/User');
const GiftMLMRewards = require('../models/GiftMLMRewards');
const router = express.Router();

function generateRandomCode() {
  const piPrefix = 'PI';
  const piDigits = 2;
  const randomPartLength = 6;

  // Generate random alphanumeric characters
  const randomPart = Math.random().toString(36).substring(2, 2 + randomPartLength).toUpperCase();

  return piPrefix + piDigits + randomPart;
}

function cleanupExpiredSessions() {
  const currentTime = new Date();
  const cleanupTime = new Date(currentTime.getTime() - 10 * 60000); // 10 minutes ago

  Session.deleteMany({ expirationTime: { $lte: cleanupTime } }, (err, result) => {
    if (err) {
      console.error('Error cleaning up expired sessions:', err);
    } else {
      console.log(`${result.deletedCount} sessions deleted within 10 minutes of expiration.`);
    }
  });
}

cron.schedule('* * * * *', cleanupExpiredSessions);

router.post('/generateCode', async (req, res) => {
  try {
    const { amount, giftTime } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount. Please provide a valid positive number.' });
    }

    if (!giftTime || isNaN(giftTime) || giftTime <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid giftTime. Please provide a valid positive number of minutes.' });
    }

    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + giftTime * 60000);

    const code = generateRandomCode();

    const session = new Session({
      amount,
      giftTime,
      code,
      expirationTime,
    });

    await session.save();

    res.json({
      success: true,
      code,
      expirationTime,
    });
  } catch (error) {
    // console.error('Error generating code:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });
  }
});

router.post('/checkCode', async (req, res) => {
  try {
    const { code, userId } = req.body;
// console.log(userId)
    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required.' });
    }
    const existingRecord = await GiftReward.findOne({ code, userId });

    if (existingRecord) {
      // Code and userId combination already exists
      return res.status(400).json({ success: false, error: 'Already Rewarded!' });
    }
  //  console.log(codeExist)
    const user = await GameProfile.findOne({userId:userId});
    if(!user){
      return res.status(404).json({ success: false, error: 'User Not found.' });
    }
    const session = await Session.findOne({ code });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Code not found. Please check the code.' });
    }
    const currentTime = new Date();
    if (currentTime > session.expirationTime) {
      // Code is expired
      return res.status(400).json({ success: false, error: 'Code is expired.' });
    }
    
    // Code is valid, fetch the last amount and generate a random number
    const lastAmount = session.amount || 0;
    const randomNumber = Math.floor(Math.random() * (lastAmount + 1));
    user.balance+=randomNumber;
   // Save the updated user object to the database
   await user.save();
    // console.log(`balance: ${user.balance}`);
    const Rewards = new GiftReward({
      userId:user.userId,
      code:code,
      reward:randomNumber
    })
    await Rewards.save();
    // console.log(Rewards);
    // console.log(user.balance);
    res.json({
      success: true,
      message: 'Code is valid.',
      lastAmount,
      randomNumber,
    });
  } catch (error) {
    // console.error('Error checking code:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });
  }
});
// MLM gift check code 
router.post('/checkCode/mlm', async (req, res) => {
  try {
    const { code, userId } = req.body;
// console.log(userId)
    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required.' });
    }
    const existingRecord = await GiftMLMRewards.findOne({ code, userId });

    if (existingRecord) {
      // Code and userId combination already exists
      return res.status(400).json({ success: false, error: 'Already Rewarded!' });
    }
  //  console.log(codeExist)
    const user = await User.findOne({userId:userId});
    if(!user){
      return res.status(404).json({ success: false, error: 'User Not found.' });
    }
    const session = await Session.findOne({ code });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Code not found. Please check the code.' });
    }
    const currentTime = new Date();
    if (currentTime > session.expirationTime) {
      // Code is expired
      return res.status(400).json({ success: false, error: 'Code is expired.' });
    }
    
    // Code is valid, fetch the last amount and generate a random number
    const lastAmount = session.amount || 0;
    const randomNumber = Math.floor(Math.random() * (lastAmount + 1));
    user.balance+=randomNumber;
    user.income += randomNumber;
    user.rewards += randomNumber;
   // Save the updated user object to the database
   await user.save();
    // console.log(`balance: ${user.balance}`);
    const Rewards = new GiftMLMRewards({
      userId:user.userId,
      code:code,
      reward:randomNumber
    })
    await Rewards.save();
    // console.log(Rewards);
    // console.log(user.balance);
    res.json({
      success: true,
      message: 'Code is valid.',
      lastAmount,
      randomNumber,
    });
  } catch (error) {
    // console.error('Error checking code:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });
  }
});
router.get("/gift-rewards/mlm/:userId", async (req, res) => {
  const userId = req.params.userId;
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const user = await GiftMLMRewards.findOne({userId: userId});
if(!user){
  return res.status(400).json({success: false, error:'User not found'});
}
    const data = await GiftMLMRewards.find({userId:userId})
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalDocuments = await GiftMLMRewards.countDocuments({userId:userId});
  const totalPages = Math.ceil(totalDocuments / perPage);

  res.json({
    data,
    totalPages,
    currentPage: page,
  });   
  } catch (error) {
    // console.error("Error fetching gift rewards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// MLM gift code end
// API endpoint for fetching 10 data at a time based on userId
router.get("/gift-rewards/:userId", async (req, res) => {
  const userId = req.params.userId;
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const user = await GiftReward.findOne({userId: userId});
if(!user){
  return res.status(400).json({success: false, error:'User not found'});
}
    const data = await GiftReward.find({userId:userId})
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalDocuments = await GiftReward.countDocuments({userId:userId});
  const totalPages = Math.ceil(totalDocuments / perPage);

  res.json({
    data,
    totalPages,
    currentPage: page,
  });   
  } catch (error) {
    // console.error("Error fetching gift rewards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
