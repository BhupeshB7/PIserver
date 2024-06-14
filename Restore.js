const mongoose = require('mongoose');
const User = require('./models/User'); // Assuming you have a User model

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhupeshkr2912:lXM1kWCDnlBvNr2y@cluster0.bjbcelw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Function to restore balance for a single user
async function restoreUserBalance(userId, updateId) {
    try {
        // Find the user update operation with the provided updateId
        const userUpdate = await User.findById(updateId);

        // If the user update operation is not found or it doesn't belong to the specified user, return
        if (!userUpdate || userUpdate.userId !== userId) {
            console.log('User update operation not found.');
            return;
        }

        // Revert user's balances back to the values before the update operation
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found.');
            return;
        }

        user.selfIncome = userUpdate.previousSelfIncome;
        user.income = userUpdate.previousIncome;
        user.teamIncome = userUpdate.previousTeamIncome;

        await user.save();

        console.log('User balance restored successfully.');
    } catch (error) {
        console.error('Error restoring user balance:', error);
    }
}

// Call the function with the userId and the updateId of the user update operation
restoreUserBalance('PI21820725', /* provide updateId */);
