
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/transferDetail", async (req, res) => {
  try {
    const users = await User.find({ "pendingTransfer.status": "Pending" });
    const pendingTransfers = users.map((user) => ({
       id:user._id,
      userId: user.userId,
      userName: user.name,
      pendingTransfer: user.pendingTransfer,
    }));
    res.json(pendingTransfers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// router.delete('/pending-transfers', async (req, res) => {
//   try {
//     const result = await User.updateMany({}, { $set: { pendingTransfer: [] } });

//     if (result.ok) {
//       const { modifiedCount } = result;
//       res.status(200).json({ message: `Removed pending transfers for ${modifiedCount} users` });
//     } else {
//       console.error('Failed to update documents:', result);
//       res.status(500).json({ error: 'Failed to remove pending transfers' });
//     }
//   } catch (error) {
//     console.error('Error removing pending transfers:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
router.post("/transfer/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const transferAmount = req.body.amount;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "User is not active" });
    }

    const hasPendingTransfer = user.pendingTransfer.some(transfer => transfer.status === "Pending");

    if (hasPendingTransfer) {
      return res.status(400).json({ error: "Cannot make new pending transfer while there is a pending transfer awaiting approval/rejection" });
    }

    // const sponsorIdMatches = await User.countDocuments({ sponsorId: user.userId, is_active: true });
    // if (sponsorIdMatches < 2) {
    //   return res.status(400).json({ error: "Minimum Two active user required for fund transfer" });
    // }

    

    let checkDirectCount = await User.countDocuments({
      sponsorId: user.userId,
      is_active: true,
    });
    if(checkDirectCount <2){
      return res.json({error:'Minimum two Active direct for Fund Transfer'})
    }
    if (transferAmount < 100) {
      return res.json({ error: 'Minimum Amount should be greater than 100' });
    }
    if (transferAmount <= user.balance) {
      const deduction = transferAmount * 0.05; // 8% deduction
      const transferAfterDeduction = transferAmount - deduction;
   
      user.balance -= transferAmount;
      user.pendingTransfer.push({
        amount: transferAfterDeduction,
        deduction: deduction,
      });
     user.topupWallet += transferAfterDeduction;
      await user.save();
        
      res.json({
        message: "Transfer SuccessFull.",
        balance: user.balance,
      });
    } else {
      console.log("Insufficient funds in the Balance wallet.");
      res.status(400).json({
        error: "Insufficient funds in the Balance wallet.",
        balance: user.balance,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all pending transfers for a specific user
router.get("/pendingTransfers/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allTransfers = user.pendingTransfer;

    res.json({ allTransfers });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assuming you have already imported the necessary dependencies and set up your Express router and User model.

router.get("/allTransfers", async (req, res) => {
  try {
    // Fetch all users from the database and populate their pending transfers
    const allUsers = await User.find().populate("pendingTransfer");

    // Create an array to store all users' pending transfers with their details
    const allTransfersWithDetails = [];

    // Loop through each user to extract their pending transfers and details
    allUsers.forEach((user) => {
      // Extract the necessary user details
      const userDetails = {
        // usersId : user.userId,
        userId: user.userId,
        userName: user.name,
        // Add other user details you want to include
      };

      // Combine the user details with their pending transfers and add to the array
      user.pendingTransfer.forEach((transfer) => {
        allTransfersWithDetails.push({
          ...userDetails,
          transferDetails: transfer,
        });
      });
    });

    // Return the array of all users' pending transfers with details
    res.json({ allTransfers: allTransfersWithDetails });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});





router.post("/transfer/approve/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pendingTransfer = user.pendingTransfer.find(transfer => transfer.status === "Pending");
    if (!pendingTransfer) {
      return res.status(400).json({ error: "No pending transfer to approve." });
    }

    user.topupWallet += pendingTransfer.amount;
    pendingTransfer.status = "Approved"; // Update the status of the pendingTransfer

    await user.save();
    res.json({ message: "Transfer approved and funds moved to TOPUP wallet.", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transfer/reject/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pendingTransfer = user.pendingTransfer.find(transfer => transfer.status === "Pending");
    if (!pendingTransfer) {
      return res.status(400).json({ error: "No pending transfer to reject." });
    }

    user.balance += pendingTransfer.amount + pendingTransfer.deduction;
    pendingTransfer.status = "Rejected"; // Update the status of the pendingTransfer

    await user.save();
    res.json({
      message: "Transfer rejected and funds returned to the income wallet.",user
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
