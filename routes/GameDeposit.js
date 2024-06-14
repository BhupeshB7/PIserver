const express = require("express");
const router = express.Router();
// server.js
// ...

const GameProfile = require("../models/GameProfile"); // Import the GameProfile model
const GameDeposit = require("../models/GameDeposit");
const GameWithdrawal = require("../models/GameWithdrawal");

// ...
// Endpoint for users to submit requests
router.post("/depositSubmit", async (req, res) => {
  try {
    const { name, amount, userId, UTR } = req.body;
    const userRequest = new GameDeposit({ name, amount, userId,UTR });
    await userRequest.save();
    res.json({ message: "Request submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Endpoint for admins to approve requests

router.post("/withdrawalSubmit", async (req, res) => {
  try {
    const { name, amount, userId, UPI,accountNo,IFSCCODE } = req.body;
    const check = await GameProfile.findOne({ userId: userId });
    if(!check){
        return res.status(404).json({ message: "UserId  not found" });
    }
    const currentDate = new Date();
  const currentIST = new Date(
    currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );

  const hours = currentIST.getHours();

  // Check if it's Sunday
  // if (dayOfWeek === 0) {
  //   return res.status(403).json({ error: 'Withdrawal not allowed on Sundays.' });
  // }

  // Check if it's before 11 AM
  if (hours <11) {
    return res.status(403).json({ error: 'Withdrawal not allowed before 11 AM.' });
  }

  // Check if it's after 1 PM
  if (hours >= 15) {
    return res.status(403).json({ error: 'Withdrawal not allowed after 3 PM.' });
  }

    if(amount > check.totalwin){
        return res.status(401).json({ message: "Insufficient Balance" });
    }
    const userRequest = new GameWithdrawal({ name, amount, userId, UPI,accountNo,IFSCCODE });
    await userRequest.save();
    check.totalwin -= amount;
    await check.save();
    res.json({ message: "Withdrawal submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/history/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
     
      // Assuming you have a Game model, you can use it to query the database
      const gameHistory = await GameWithdrawal.find({ userId: userId });
      res.json(gameHistory);
    } catch (err) {
      console.error(`Error fetching game history: ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 
router.get('/withdraw/history', async (req, res) => {
  try {
    // Pagination parameters (page and perPage)
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const perPage = parseInt(req.query.perPage) || 20; // Default to 10 items per page

    // Calculate the skip value based on pagination parameters
    const skip = (page - 1) * perPage;

    // Query the database with pagination
    const gameHistory = await GameWithdrawal.find()
      .skip(skip)
      .limit(perPage);

    // Count the total number of records (needed for pagination)
    const totalRecords = await GameWithdrawal.countDocuments();

    const totalPages = Math.ceil(totalRecords / perPage);

    res.json({ gameHistory, totalPages });
  } catch (err) {
    console.error(`Error fetching game history: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  router.get('/deposit/history/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Assuming you have a Game model, you can use it to query the database
      const gameHistory = await GameDeposit.find({ userId: userId });
      res.json(gameHistory);
    } catch (err) {
      console.error(`Error fetching game history: ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/deposit/history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page from query parameters
    const limit = parseInt(req.query.limit) || 20; // Get the number of items per page from query parameters

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Assuming you have a Game model, you can use it to query the database with pagination
    const totalRecords = await GameDeposit.countDocuments(); // Get the total count of records

    const gameHistory = await GameDeposit.find()
      .skip(startIndex)
      .limit(limit);

    const paginationInfo = {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
    };

    res.json({ gameHistory, paginationInfo });
  } catch (err) {
    // console.error(`Error fetching game history: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put("/approve/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { amount } = req.body;
    
    const userRequest = await GameDeposit.findByIdAndUpdate(id, {
      isApproved: true, // Set the status to 'Approved' using the correct field name
    });

    if (!userRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Fetch the user's profile by userId
    const userProfile = await GameProfile.findOne({
      userId: userRequest.userId,
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Check if amount is a valid number
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount value" });
    }

    // Update the balance in the user's profile (assuming userRequest.amount is the deposit amount)
    userProfile.balance += parseFloat(amount); // Convert amount to a number if it's a string
    await userProfile.save();

    res.json({ message: "Request approved and balance updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/gameDeposit/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const depositDelete = await GameDeposit.findById(id);

    if (!depositDelete) {
      return res.status(401).send("Deposit not found!");
    }

    await GameDeposit.deleteOne({ _id: id });
    res.status(200).send("Deposit deleted successfully!");
  } catch (error) {
    // console.log(error);
    res.status(500).send(error);
  }
});
  router.put("/Withdrawal/approve/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const userRequest = await GameWithdrawal.findByIdAndUpdate(id, {
        approved: "Approved", // Set the status to 'Approved'
      });
  
      if (!userRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json({ message: "Approved  successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// ...
router.get('/statistics', async (req, res) => {
  try {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const sevenDaysAgo = new Date(today - 7 * oneDay); // Seven days ago
    const yesterday = new Date(today - oneDay); // Yesterday

    // Find the previous seven-day total amount
    const sevenDayTotalAmount = await GameDeposit.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$depositAmount' },
        },
      },
    ]);

    // Find the previous seven-day pending amount
    const sevenDayPendingAmount = await GameDeposit.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
          isApproved:false,
        },
      },
      {
        $group: {
          _id: null,
          totalPendingAmount: { $sum: '$depositAmount' },
        },
      },
    ]);

    // Find the previous seven-day approved amount
    const sevenDayApprovedAmount = await GameDeposit.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
          isApproved:true,
        },
      },
      {
        $group: {
          _id: null,
          totalApprovedAmount: { $sum: '$depositAmount' },
        },
      },
    ]);

    // Find yesterday's approved amount
    const yesterdayApprovedAmount = await GameDeposit.aggregate([
      {
        $match: {
          createdAt: {
            $gte: yesterday,
            $lte: today,
          },
          isApproved:true,
        },
      },
      {
        $group: {
          _id: null,
          yesterdayApprovedAmount: { $sum: '$depositAmount' },
        },
      },
    ]);

    // Find yesterday's total amount
    const yesterdayTotalAmount = await GameDeposit.aggregate([
      {
        $match: {
          createdAt: {
            $gte: yesterday,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          yesterdayTotalAmount: { $sum: '$depositAmount' },
        },
      },
    ]);
    // Find yesterday's approved amount
    const yesterdayWithdrawalAmount = await GameWithdrawal.aggregate([
      {
        $match: {
          createdAt: {
            $gte: yesterday,
            $lte: today,
          },
          approved:'Approved',
        },
      },
      {
        $group: {
          _id: null,
          yesterdayWithdrawalAmount: { $sum: '$amount' },
        },
      },
    ]);
    // Find yesterday's approved amount
    const yesterdayWithdrawalPendingAmount = await GameWithdrawal.aggregate([
      {
        $match: {
          createdAt: {
            $gte: yesterday,
            $lte: today,
          },
          approved:'Pending',
        },
      },
      {
        $group: {
          _id: null,
          yesterdayWithdrawalPendingAmount: { $sum: '$amount' },
        },
      },
    ]);

    // Find yesterday's total amount
    const yesterdayTotalWithdrawalAmount = await GameWithdrawal.aggregate([
      {
        $match: {
          createdAt: {
            $gte: yesterday,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          yesterdayTotalWithdrawalAmount: { $sum: '$amount' },
        },
      },
    ]);

    res.json({
      sevenDayTotalAmount: sevenDayTotalAmount[0]?.totalAmount || 0,
      sevenDayPendingAmount: sevenDayPendingAmount[0]?.totalPendingAmount || 0,
      sevenDayApprovedAmount: sevenDayApprovedAmount[0]?.totalApprovedAmount || 0,
      yesterdayApprovedAmount: yesterdayApprovedAmount[0]?.yesterdayApprovedAmount || 0,
      yesterdayTotalAmount: yesterdayTotalAmount[0]?.yesterdayTotalAmount || 0,
      yesterdayWithdrawalAmount: yesterdayWithdrawalAmount[0]?.yesterdayWithdrawalAmount || 0,
      yesterdayWithdrawalPendingAmount: yesterdayWithdrawalPendingAmount[0]?.yesterdayWithdrawalPendingAmount || 0,
      yesterdayTotalWithdrawalAmount: yesterdayTotalWithdrawalAmount[0]?.yesterdayTotalWithdrawalAmount || 0,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
