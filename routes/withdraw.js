const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const { Mutex } = require("async-mutex");
const mutex = new Mutex();
// import database models
const User = require("../models/User");
const WithdrawalReq = require("../models/WithdrawReq");
const WithdrawBalance = require("../models/WithdrawBalance");

// router.use(express.json());
const router = express.Router();

// All withdrawal Code
router.post("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { amount, ifscCode, accountNo, accountHolderName } = req.body;
  // Check if ifscCode, accountNo, and accountHolderName lengths are greater than 3
  if (
    ifscCode.length <= 3 ||
    accountNo.length <= 3 ||
    accountHolderName.length <= 3
  ) {
    return res
      .status(400)
      .json({ error: "Update your profile. Please provide valid details." });
  }

  const release = await mutex.acquire();
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the withdrawal amount is greater than 0
    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Withdrawal amount should be greater than 0" });
    }
    const currentDate = new Date();
    const currentIST = new Date(
      currentDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const dayOfWeek = currentIST.getDay();
    const hours = currentIST.getHours();

    // Check if it's Sunday
    if (dayOfWeek === 0) {
      return res
        .status(403)
        .json({ error: "Withdrawal not allowed on Sundays." });
    }

    // Check if it's before 9 AM
    if (hours < 12) {
      return res
        .status(403)
        .json({ error: "Withdrawal not allowed before 12 PM." });
    }

    // Check if it's after 1 PM
    if (hours >= 14) {
      return res
        .status(403)
        .json({ error: "Withdrawal not allowed After 2 PM." });
    }
    const today = moment().startOf("day");
    const tomorrow = moment(today).add(1, "days");

    const todayTransactionTotal = await WithdrawBalance.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() },
        },
      },
      {
        $group: {
          _id: null,
          totalWithdrawal: { $sum: "$amount" },
        },
      },
    ]);

    const totalWithdrawalToday =
      todayTransactionTotal.length > 0
        ? todayTransactionTotal[0].totalWithdrawal
        : 0;

    if (totalWithdrawalToday >= 4000) {
      return res.status(400).json({
        error:
          "Today's withdrawal limit reached. Please make a withdrawal tomorrow.",
      });
    }
    if (amount > 400) {
      return res
        .status(400)
        .json({ error: "withdrawal amount Should be 400 Rs" });
    }
    if (amount === 400) {
      // Check if the user is active
      if (!user.is_active) {
        return res
          .status(400)
          .json({ error: "User is not active and cannot make withdrawals" });
      }

      // Check if user has at least two direct referrals
      const count = await User.countDocuments({
        sponsorId: userId,
        is_active: true,
      });
      // console.log(count);
      if (count < 2) {
        return res
          .status(400)
          .json({ error: "Minimum Two Direct for Withdrawal" });
      }
      if (user.package === 999 || user.package === 1000|| user.package ===500 || user.package ===499) {
        const downlineUsers = await User.find({
          sponsorId: user.userId,
          is_active: true,
        }).select('package');
      
        const totalPackageValue = downlineUsers.reduce((total, downlineUser) => total + downlineUser.package, 0);
      
        if (totalPackageValue < 2000) {
          return res.status(400).json({
            error: "You should have a total package value of at least 2000 for withdrawal.",
          });
        }
      }
      
      // Check if user balance is sufficient for the withdrawal
      if (user.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      if (!user.withdrawalDone) {
        return res.status(403).json({
          error:
            "First complete the withdrawal of Rs 50 then you will be able to withdraw Rs 400.",
        });
      }

      // Create a new withdrawal request
      const withdrawalRequest = new WithdrawBalance({
        userId,
        amount,
        ifscCode,
        accountNo,
        accountHolderName,
      });

      await withdrawalRequest.save();

      // Update user withdrawal and balance
      user.withdrawal += amount;
      user.balance -= amount;
      await user.save();

      return res.json({ success: true });
    } else if (amount === 50) {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const withdrawalReq = await WithdrawBalance.findOne({
        userId: userId,
        status: "approved",
      });
      if (withdrawalReq) {
        return res
          .status(403)
          .json({ success: false, error: "Already payments of 50" });
      }
      // Check if user has already made a withdrawal of 200 Rs
      if (user.withdrawalDone) {
        return res
          .status(403)
          .json({ error: "Withdrawal of 50 Rs already done" });
      }

      // Check if user balance is sufficient for the withdrawal
      if (user.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Create a new withdrawal request
      const withdrawalRequest = new WithdrawBalance({
        userId,
        amount,
        ifscCode,
        accountNo,
        accountHolderName,
      });

      await withdrawalRequest.save();

      // Update user withdrawal and balance
      user.withdrawal += amount;
      user.balance -= amount;
      user.withdrawalDone = true;
      await user.save();

      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ error: " withdrawal amount Should be 400 Rs" });
    }
  } catch (error) {
    // Release the lock in case of any error
    release();
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    release();
  }
});
// Withdrawal code ENd


// endpoint for admin to fetch a specific withdrawal request
router.get("/withdrawals/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const withdrawalRequest = await WithdrawBalance.find({ userId: userId });
    if (!withdrawalRequest) {
      return res.status(404).json({ error: "Withdrawal request not found" });
    }
    res.json(withdrawalRequest);
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint for admin to fetch all withdrawal requests
// router.get('/withdrawals', async (req, res) => {

//   const withdrawalQuerySearch = req.query.search;
//   const searchRegx = new RegExp(withdrawalQuerySearch, 'i');

//   try {
//     const withdrawalRequests = await WithdrawalReq.find({
//       $or:[
//         {name: searchRegx},
//         {userId: searchRegx}
//       ]
//     });
//     res.json(withdrawalRequests);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
// endpoint for admin to fetch paginated withdrawal requests
router.get("/withdrawals", async (req, res) => {
  const withdrawalQuerySearch = req.query.search;
  const searchRegx = new RegExp(withdrawalQuerySearch, "i");

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 20; // Default to 10 items per page

  const skip = (page - 1) * limit;

  try {
    const query = {
      $or: [{ name: searchRegx }, { userId: searchRegx }],
    };

    const totalItems = await WithdrawBalance.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const withdrawalRequests = await WithdrawBalance.find(query)
      .skip(skip)
      .limit(limit);

    res.json({
      withdrawalRequests,
      totalPages,
      currentPage: page,
      totalItems,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint for admin to update the status and transaction number of a withdrawal request
router.put("/withdrawals/:id", async (req, res) => {
  const { id } = req.params;
  const { status, transactionNumber } = req.body;
  try {
    const withdrawalRequest = await WithdrawBalance.findByIdAndUpdate(
      id,
      { status, transactionNumber },
      { new: true }
    );
    if (!withdrawalRequest) {
      return res.status(404).json({ error: "Withdrawal request not found" });
    }
    withdrawalRequest.status = "approved";
    await withdrawalRequest.save();
    res.json(withdrawalRequest);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error);
  }
});
// Add the following route for handling withdrawal rejection and refund
router.put("/withdrawals/reject/:id", async (req, res) => {
  const { id } = req.params;
  // Check if the provided ID is not a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const withdrawalRequest = await WithdrawBalance.findByIdAndUpdate(id);
    if (!withdrawalRequest) {
      return res.status(404).json({ error: "Withdrawal request not found" });
    }

    // Check if amount is defined in the withdrawal request
    if (withdrawalRequest.amount === undefined) {
      return res.status(400).json({ error: "Withdrawal amount not defined" });
    }
    const useruserId = withdrawalRequest.userId;
    // Refund the amount to the user's wallet
    // Assuming you have a User model with a wallet field
    const user = await User.findOne({ userId: useruserId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Access the withdrawal amount
    const refundAmount = withdrawalRequest.amount;
    user.withdrawal -= refundAmount;
    // Refund the amount to the user's wallet
    user.balance += refundAmount;
    // user.withdrawalDone = false;
    withdrawalRequest.status = "rejected";

    // Use a transaction to ensure both updates (user wallet and withdrawal status) are atomic
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await user.save();
      await withdrawalRequest.save();
      await session.commitTransaction();
      session.endSession();
      res.json({ message: "Withdrawal rejected and amount refunded" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json(error);
  }
});

// Delete a user
router.delete("/withdrawalWallet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await WithdrawBalance.findByIdAndDelete({ _id: id });
    res.status(200).send("Deleted successfully"); // Success, no content
  } catch (error) {
    // console.error(error);
    res.status(500).send("something went wrong"); // Internal server error
  }
});

router.get('/allAmounts/summary', async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayAmount = await WithdrawBalance.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate())
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const todayAmount = await WithdrawBalance.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);
    const todayApprovedAmount = await WithdrawBalance.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
          },
          status: "approved"
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      yesterdayAmount: yesterdayAmount.length > 0 ? yesterdayAmount[0].totalAmount : 0,
      todayAmount: todayAmount.length > 0 ? todayAmount[0].totalAmount : 0,
      todayApprovedAmount: todayApprovedAmount.length > 0 ? todayApprovedAmount[0].totalAmount : 0
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
