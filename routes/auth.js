const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const axios = require('axios');
const router = express.Router();
const cron = require('node-cron');
router.post("/login", async (req, res) => {
  const { userId, password, captchaResponse} = req.body;
 // Verify the captcha response with the captcha service's API
//  const captchaSecretKey = '6LdxqJ0pAAAAAKXlE0jI0hAI6XmcGw52OIIktwQv';
//  const captchaSecretKey = '6Lc1-wgmAAAAAFTFsy_Hkk_a33hV94dP1XNwTzig';
//  const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecretKey}&response=${captchaResponse}`;


  try {
    // const response = await axios.post(captchaVerifyUrl);
    // const { success } = response.data;
    // if(success){
      
    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password!" });
    }

   
    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });
    res.json({ token });
    // }else{
    //    // Return an error response indicating invalid captcha
    //    res.status(401).json({ error: 'Invalid captcha' });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/block/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});  
router.put('/unblock/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// router.get('/bonanzaOffers/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId; // Assuming it's a POST request and user ID is in the request body
//     const currentDate = new Date();
    
//     // Check if the current day is Sunday (day of the week: 0)
//     if (currentDate.getDay() !== 0) {
//       return res.status(400).json({ error: "Bonanza Offers are only allowed on Sundays" });
//     }

//     currentDate.setHours(0, 0, 0, 0);
//      // Check if the user with the specified userId exists
//     const sponsorExists = await User.exists({ userId: req.params.userId });
    
//     if (!sponsorExists) {
//       return res.status(404).json({ error: "User Not Found" });
//     }

//     // Fetch direct downline users with activationTime matching the current date
//     const downlineUsers = await User.find({
//       sponsorId: userId,
//       activationTime: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 86400000) } // Adding 24 hours to get the next day
//     }).select("userId sponsorId name mobile activationTime");
//    if(!downlineUsers){
//     res.status(400).json({error:"User Not Found"})
//    }
//     // Count the downline users
//     const downlineCount = downlineUsers.length;

//     // Respond with the downline count and details
//     res.status(200).json({ count: downlineCount, details: downlineUsers });
//   } catch (error) {
//     console.error(error);

//     // Advanced error handling
//     let errorMessage = "Internal Server Error";
//     let statusCode = 500;

//     if (error.name === "CastError") {
//       errorMessage = "Invalid user ID format";
//       statusCode = 400;
//     } else if (error.name === "ValidationError") {
//       errorMessage = "Validation error";
//       statusCode = 422;
//     }

//     res.status(statusCode).json({ error: errorMessage });
//   }
// });


// Route to update all users' balances to 0
router.get('/bonanzaOffers/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming it's a POST request and user ID is in the request body
    const currentDate = new Date();
    // Check if the current day is Sunday (day of the week: 0)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 1 ) {
      return res.status(400).json({ error: "Bonanza Offer details check  only allowed on Sundays and Mondays" });
    }

    // Calculate the date of the most recent Sunday
    const lastSunday = new Date(currentDate);
    lastSunday.setDate(currentDate.getDate() - currentDate.getDay());

    // Set the time to midnight of that Sunday
    lastSunday.setHours(0, 0, 0, 0);

    // Check if the user with the specified userId exists
    const sponsorExists = await User.exists({ userId: req.params.userId });

    if (!sponsorExists) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Fetch direct downline users with activationTime matching the last Sunday
    const downlineUsers = await User.find({
      sponsorId: userId,
      activationTime: {
        $gte: lastSunday,
        $lt: new Date(lastSunday.getTime() + 86400000) // Adding 24 hours to get the next day
      }
    }).select("userId sponsorId name mobile activationTime");

    if (!downlineUsers) {
      res.status(400).json({ error: "User Not Found" });
    }

    // Count the downline users
    const downlineCount = downlineUsers.length;

    // Respond with the downline count and details
    res.status(200).json({ count: downlineCount, details: downlineUsers });
  } catch (error) {
    console.error(error);

    // Advanced error handling
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    if (error.name === "CastError") {
      errorMessage = "Invalid user ID format";
      statusCode = 400;
    } else if (error.name === "ValidationError") {
      errorMessage = "Validation error";
      statusCode = 422;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
});

router.post('/resetBalances', async (req, res) => {
  const controller = new AbortController();
  const signal = controller.signal;

  // Attach the abort controller's signal to the request
  req.on('abort', () => {
    console.log('Request aborted');
    controller.abort();
  });

  try {
    // Simulate a time-consuming task (e.g., fetching data from a remote server)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if the request has been aborted before performing the database update
    if (signal.aborted) {
      console.log('Request aborted before updating balances.');
      return;
    }

    await User.updateMany({}, { $set: { balance: 0, selfIncome: 0, teamIncome: 0, income: 0 } });
    res.json({ success: true, message: 'Balances reset successfully.' });
  } catch (error) {
    if (error.name === 'AbortError') {
      // console.log('Request aborted during the operation.');
      return;
    }

    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
cron.schedule('* * * * * ', async () => {
  try {
    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 70);

    // Find users with activationTime not null and greater than or equal to 70 days ago
    const usersToUpdate = await User.find({
      activationTime: { $lte: cutoffDate }, // Using $lte (less than or equal to) instead of $lt
      is_active: true
    });
    // console.log(usersToUpdate)
    // Update is_active to false for eligible users
    await Promise.all(usersToUpdate.map(async (user) => {
      user.is_active = false;
      await user.save();
    }));

    // console.log("Activation status updated successfully at", new Date());
  } catch (err) {
    // console.error("Error updating activation status:", err);
  }
});
router.get('/checkActivation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const activationDate = user.activationTime;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 70);

    if (cutoffDate >= activationDate) {
      res.status(200).json({ success: true, reTopUpRequired: true, message: "Your account activation time has ended. Please Re-TopUp your Account." });
    } else {
      res.status(200).json({ success: true, reTopUpRequired: false, message: "Your account is still active." });
    }
  } catch (err) {
    // console.error("Error checking activation:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
