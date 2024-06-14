
// Controller methods for CRUD operations
// controllers/gameProfileController.js
const GameProfile = require('../models/GameProfile');

// Controller function to fetch a GameProfile document and populate the userId field with User data
const getProfile = async (req, res) => {
  try {
    const { gameProfileId } = req.params; // Assuming you pass gameProfileId as a URL parameter
    const gameProfile = await GameProfile.findOne({ userId: gameProfileId }).populate('userId');

    if (!gameProfile) {
      return res.status(404).json({ message: 'GameProfile not found' });
    }
 
    res.json(gameProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Example for getting a profile
// const getProfile = async (req, res) => {
//   try {
//     const profile = await Profile.findOne();
//     if (!profile) {
//       return res.status(404).json({ message: 'Profile not found' });
//     }
//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


// router.post('/submit', async (req, res) => {
//   try {
//     const { name, balance, UPI, withdrawalAmount } = req.body;
//       // Check if mobile number already exists
//       const balanceCheck = await User.findOne({ mobile });
//       if (mobileExists) {
//         return res.status(400).json({ error: 'Mobile number already exists' });
//       }
//     const gameWithdrawal = new GameWithdrawal({ name, balance, UPI, withdrawalAmount });
//     await gameWithdrawal.save();
//     res.json({ message: 'Form data submitted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
module.exports = {
  getProfile,
  // Implement other controller methods for creating and deleting profiles
};
