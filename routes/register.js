const express = require('express');
const { registerUser } = require('../controllers/userControllers');
const User = require('../models/User');
const router = express.Router();
const moment = require('moment');
router.get("/getSponsorName/:sponsorId", async (req, res) => {
  const sponsorId = req.params.sponsorId;
  try {
    const sponsor = await User.findOne({ userId: sponsorId });
    if (sponsor) {
      res.json({ name: sponsor.name }); // Assuming the name is a property in your User model
    } else {
      res.status(404).json({ error: "Sponsor ID not found" });
    }
  } catch (error) {
    // console.error("Error fetching sponsor name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post('/register', registerUser);
// API route to find daily new user registrations
// API route to find daily new user registrations for the previous 7 days
// API route to find daily new user registrations for the previous 7 days including yesterday and today
// router.get('/daily-new-users', async (req, res) => {
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
  
//       const yesterday = new Date(today);
//       yesterday.setDate(today.getDate() - 2);
  
//       const lastWeek = new Date(today);
//       lastWeek.setDate(today.getDate() - 7);
  
//       const dailyNewUsers = await User.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: lastWeek, $lt: today },
//           },
//         },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdAt' },
//               month: { $month: '$createdAt' },
//               day: { $dayOfMonth: '$createdAt' },
//             },
//             count: { $sum: 1 },
//           },
//         },
//         {
//           $sort: {
//             '_id.year': 1,
//             '_id.month': 1,
//             '_id.day': 1,
//           },
//         },
//       ]);
  
//       res.json(dailyNewUsers);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  // API route to fetch new users in the last 7 days
router.get('/daily-new-users', async (req, res) => {
    try {
      const sevenDaysAgo = moment().subtract(15, 'days').toDate();
      const newUsersCount = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  
      res.json({ count: newUsersCount });
    } catch (err) {
        // console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
module.exports = router;
