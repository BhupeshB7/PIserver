// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/GameProfileController');
const GameProfile = require('../models/GameProfile');
const cron = require('node-cron');
const GmeRecord = require('../models/GmeRecord');
const oneMinuteGameRecord = require('../models/OneMGameRecord');
const threeMinuteGameRecord = require('../models/ThreeMGameHistory');
const oneMinuteGameHistory = require('../models/OneMinuteHistory');
// Define routes for CRUD operations
router.get('/:gameProfileId', profileController.getProfile);

// Route to start the game and deduct the entry fee
router.post('/startGame', async (req, res) => {
  const { userId, entryFee } = req.body;

  try {
    // Fetch the user's profile by userId
    const userProfile = await GameProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Check if the user's balance is sufficient
    if (userProfile.balance >= entryFee) {
      // Deduct the entry fee from the balance
      userProfile.balance -= entryFee;

      // Save the updated user profile
      await userProfile.save();

      // Return the updated user profile with the new balance
      return res.json({ balance: userProfile.balance });
    } else {
      return res.status(400).json({ message: 'Insufficient balance to play' });
    }
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// API endpoint for checking user choices
router.post('/checkChoices', async (req, res) => {
  try {
    const {
      userId,
      userChoiceLetter,
      userChoiceNumber,
      userChoiceColor,
      betAmount,
      choiceLetter,
      choiceNumber,
      choiceColor,
      session,
    } = req.body;

    // Validation example: Check if betAmount is a valid number
    if (isNaN(parseFloat(betAmount))) {
      return res.status(400).json({ error: 'Invalid betAmount' });
    }

    const userGamerProfile = await GameProfile.findOne({ userId });

    let result;
    let message;
    let amount;
    let userChoice;
    let choice;
    let conditionMatched = false;

    if (userChoiceLetter && userChoiceLetter === choiceLetter) {
      result = 'success';
      message = 'ChoiceLetter matched!';
      amount = parseFloat(betAmount) * 2; // Change this multiplier as per your winning logic
      userGamerProfile.totalwin += amount;
      userChoice = userChoiceLetter;
      choice = choiceLetter;
      conditionMatched = true;
    }

    if (!conditionMatched && userChoiceNumber && userChoiceNumber === choiceNumber) {
      result = 'success';
      message = 'ChoiceNumber matched!';
      amount = parseFloat(betAmount) * 2; // Change this multiplier as per your winning logic
      userGamerProfile.totalwin += amount;
      userChoice = userChoiceNumber;
      choice = choiceNumber;
      conditionMatched = true;
    }

    if (!conditionMatched && userChoiceColor && userChoiceColor === choiceColor) {
      result = 'success';
      message = 'ChoiceColor matched!';
      amount = parseFloat(betAmount) * 2; // Change this multiplier as per your winning logic
      userGamerProfile.totalwin += amount;
      userChoice = userChoiceColor;
      choice = choiceColor;
      conditionMatched = true;
    }

    if (!conditionMatched) {
      userChoice = userChoiceLetter || userChoiceNumber || userChoiceColor;
      if (userChoice === userChoiceLetter) {
        // Handle userChoiceLetter case
        result = 'failed';
        message = 'No match found!';
        amount = parseFloat(betAmount);
        userChoice = userChoiceLetter;
        choice = choiceLetter; // Set choice to choiceLetter
    } else if (userChoice === userChoiceNumber) {
        // Handle userChoiceNumber case
        result = 'failed';
        message = 'No match found!';
        amount = parseFloat(betAmount);
        userChoice = userChoiceNumber;
        choice = choiceNumber; // Set choice to choiceNumber
    } else if(userChoice === userChoiceColor) {
        // Handle userChoiceColor case
        result = 'failed';
        message = 'No match found!';
        amount = parseFloat(betAmount);
        userChoice = userChoiceColor;
        choice = choiceColor; // Set choice to choiceColor
    }
  }
    await userGamerProfile.save(); // Save the updated user profile

    const newResult = new GmeRecord({
      userId,
      result,
      message,
      amount,
      userChoice,
      choice,
      session,
    });

    await newResult.save();

    return res.status(200).json({ result, message, amount, userChoice, choice });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get user details with pagination and sorting
router.get('/userDetails/:userId/:page', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.params.page) || 1;
    const pageSize = 10;
    const totalDocuments = await oneMinuteGameRecord.countDocuments({userId:userId})
    const totalPages = Math.ceil(totalDocuments / pageSize);
    // Calculate the skip value based on the page number
    const skip = (page - 1) * pageSize;

    // Fetch user details with pagination and sorting by timestamp in descending order
    const userResults = await oneMinuteGameRecord.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Send the user details to the frontend
    res.json({userResults,totalPages});
  } catch (error) {
    // console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/userDetails/history/:userId/:page', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.params.page) || 1;
    const pageSize = 10;
    const totalDocuments = await oneMinuteGameHistory.countDocuments({userId:userId})
    // console.log(totalDocuments);
    const totalPages = Math.ceil(totalDocuments / pageSize);
    // Calculate the skip value based on the page number
    const skip = (page - 1) * pageSize;

    // Fetch user details with pagination and sorting by timestamp in descending order
    const userResults = await oneMinuteGameHistory.find({ userId:userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Send the user details to the frontend
    res.json({userResults,totalPages});
  } catch (error) {
    // console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// Route to get user details with pagination and sorting
router.get('/userDetails3/:userId/:page', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.params.page) || 1;
    const pageSize = 10;
    const totalDocuments = await threeMinuteGameRecord.countDocuments({userId:userId})
    const totalPages = Math.ceil(totalDocuments / pageSize);
    // Calculate the skip value based on the page number
    const skip = (page - 1) * pageSize;

    // Fetch user details with pagination and sorting by timestamp in descending order
    const userResults = await threeMinuteGameRecord.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Send the user details to the frontend
    res.json({userResults,totalPages});
  } catch (error) {
    // console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// Schedule daily income reset using cron
// cron.schedule('42 16 * * *', async () => {
//   try {
//     // Reset dailyIncome for all users
//     await GameProfile.updateMany({},{ $set: { totalwin: 0 } });
//     console.log('Daily income reset successful for incomeWallet of game profile');
//   } catch (error) {
//     console.error('Error resetting daily income:', error);
//   }
// }, {
//   timezone: 'Asia/Kolkata', // Set the timezone to IST
// });


module.exports = router;
