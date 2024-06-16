const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const NodeCache = require("node-cache");
const router = express.Router();

// Manually update user wallet through API
router.post("/userWalletUpdating/", async (req, res) => {
  const { userId } = req.body;
  try {
    let user = await User.findOne({ userId: userId }).select('userId');
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (req.body.balance) {
      user.balance = req.body.balance.trim();
    }
    if (req.body.income) {
      user.income = req.body.income.trim();
    }
    if (req.body.selfIncome) {
      user.selfIncome = req.body.selfIncome.trim();
    }
    if (req.body.teamIncome) {
      user.teamIncome = req.body.teamIncome.trim();
    }
    if (req.body.withdrawal) {
      user.withdrawal = req.body.withdrawal.trim();
    }
    if (req.body.rewards) {
      user.rewards = req.body.rewards.trim();
    }
    await user.save();
    res.status(200).send("User wallet updated successfully");
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//old downline code  line no 176 - 237
//
// new downline code 239-299
router.get('/team/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const teamStructure = await getUserTeam(userId, 6); // Set the depth to 5 levels
    res.json(teamStructure);
  } catch (error) {
    // console.error('Error fetching team structure:', error);
    res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
  }
});

async function getUserTeam(userId, depth) {
  try {
    if (depth <= 0) {
      // If depth reaches 0, return null to stop recursion
      return null;
    }

    const user = await User.findOne({ userId }).select('userId name mobile is_active').lean();

    if (!user) {
      return null;
    }

    const activeStatus = user.is_active ? 'active' : 'not active';
    const teamStructure = {
      level: 6-depth,
      userId: user.userId,
      name: user.name,
      mobile: user.mobile,
      status: activeStatus,
      downlineCount: 0,
      activeDownlineCount: 0,
      allUsersCount: 0,
      activeUsersCount: 0,
      downline: [],
    };

    const downlineUsers = await User.find({ sponsorId: userId }).lean();
    const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId, depth - 1)); // Decrement depth in recursive call
    const downlineTeam = await Promise.all(downlinePromises);

    // Remove null elements from downlineTeam array
    const filteredDownlineTeam = downlineTeam.filter((item) => item !== null);

    teamStructure.downline = filteredDownlineTeam;
    teamStructure.downlineCount = filteredDownlineTeam.length;
    teamStructure.activeDownlineCount = filteredDownlineTeam.reduce((count, downline) => count + (downline.status === 'active' ? 1 : 0), 0);

    // Count number of all users and active users
    teamStructure.allUsersCount = filteredDownlineTeam.reduce((count, downline) => count + downline.allUsersCount + 1, 0);
    teamStructure.activeUsersCount = filteredDownlineTeam.reduce((count, downline) => count + downline.activeUsersCount + (downline.status === 'active' ? 1 : 0), 0);

    return teamStructure;
  } catch (error) {
    // console.error('Error fetching user:', error);
    throw error;
  }
}
// new down line code 239-299

const cache = new NodeCache({ stdTTL: 60 }); // Set cache TTL to 60 seconds (adjust as needed)

router.get('/teamStructure/:userId', async (req, res) => {
  const { userId } = req.params;
  const cachedData = cache.get(userId);

  if (cachedData) {
    // console.log("Serving from cache");
    res.json(cachedData);
  } else {
    try {
      const teamStructure = await getUserTeamStructure(userId, 5);
      const usersByLevel = countUsersByLevel(teamStructure);
      cache.set(userId, usersByLevel); // Cache the data
      res.json(usersByLevel);
    } catch (error) {
      // console.error('Error fetching team structure:', error);
      res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
    }
  }
});

async function getUserTeamStructure(userId, depth) {
  try {
    if (depth <= 0) {
      // If depth reaches 0, return null to stop recursion
      return null;
    }

    const user = await User.findOne({ userId }).select('userId is_active').lean();

    if (!user) {
      return null;
    }

    const activeStatus = user.is_active ? 'active' : 'not active';
    const teamStructure = {
      level: 6 - depth,
      userId: user.userId,
      status: activeStatus,
      downline: [],
    };

    const downlineUsers = await User.find({ sponsorId: userId }).lean();
    const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId, depth - 1)); // Decrement depth in recursive call
    const downlineTeam = await Promise.all(downlinePromises);

    // Remove null elements from downlineTeam array
    const filteredDownlineTeam = downlineTeam.filter((item) => item !== null);

    teamStructure.downline = filteredDownlineTeam;

    return teamStructure;
  } catch (error) {
    // console.error('Error fetching user:', error);
    throw error;
  }
}

function countUsersByLevel(teamStructure) {
  const result = {};

  function traverse(node) {
    if (!node) return;

    const status = node.status === 'active' ? 'active' : 'inactive';
    result[`${node.level}`] = (result[`${node.level}`] || { active: 0, inactive: 0 });
    result[`${node.level}`][status]++;

    node.downline.forEach((child) => traverse(child));
  }

  traverse(teamStructure);
  return result;
}





// Level Structure End
// count the Rank of user 
// count the Rank of user End
//latest code that show the Rank
// 
//latest code that show the Rank End
//new latest code that show the Rank start

// new latest code that show the Rank End

router.get('/teamStructureRank/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const teamStructure = await getUserTeamStructure(userId, 6); // Set the depth to 5 levels
    const activeUsersByLevel = countActiveUsersByLevel(teamStructure);
    const rankedUser = getHighestAchievedRank(activeUsersByLevel);
    res.json(rankedUser);
  } catch (error) {
    // console.error('Error fetching team structure:', error);
    res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
  }
});

function countActiveUsersByLevel(teamStructure) {
  const result = {};

  function traverse(node) {
    if (!node) return;

    if (node.status === 'active') {
      result[node.level] = (result[node.level] || 0) + 1;
    }

    node.downline.forEach((child) => traverse(child));
  }

  traverse(teamStructure);
  return result;
}

function getHighestAchievedRank(activeUsersByLevel) {
  const rankThresholds = {
    Star: 10,
    TopLeader: 60,
    RoyalGold: 300,
    Diamond: 800,
  };

  let highestAchievedRank = 'Fresher';

  for (let level = 1; level <= 5; level++) {
    const count = activeUsersByLevel[level] || 0;
        // console.log(count);
    if (level === 1 && count >= rankThresholds.Star) {
      highestAchievedRank = 'Star';
    } else if (level === 2 && count >= rankThresholds.TopLeader) {
      highestAchievedRank = 'Top Leader';
    } else if (level === 3 && count >= rankThresholds.RoyalGold) {
      highestAchievedRank = 'ROyal Gold';
    } 
    else if (level === 5 && count >= rankThresholds.Diamond) {
      highestAchievedRank = 'Diamond';
    }
  }

  return { rank: highestAchievedRank };
}

router.post("/updateWalletss/:userId", async (req, res) => {
  const { userId } = req.params;
  let user = await User.findOne({ userId: userId });
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Check if it's a new day and reset earnings if necessary
  const currentDate = new Date();
  const lastUpdatedDate = user.lastUpdated || currentDate;
  if (!isSameDay(currentDate, lastUpdatedDate)) {
    user.balance = 0;
    user.income = 0;
    user.selfIncome = 0;
  }

  const rankInfo = await getHighestAchievedRank(userId); // Get user's rank info
  const rank = rankInfo.rank;

  // Define the maximum earnings based on the user's rank
  let maximumEarnings = 0;
  switch (rank) {
    case 'Fresher':
      maximumEarnings = 650;
      break;
    case 'Star':
      maximumEarnings = 1300;
      break;
    case 'Silver':
      maximumEarnings = 2500;
      break;
    case 'Gold':
      maximumEarnings = 3500;
      break;
    case 'RoyalGOld':
      maximumEarnings = 5000;
      break;
    case 'Diamond':
      maximumEarnings = 10000;
      break;
    default:
      maximumEarnings = 0; // You may want to handle other ranks accordingly
      break;
  }

  // Calculate remaining earnings allowed for the day
  const remainingBalance = maximumEarnings - user.balance;
  const remainingIncome = maximumEarnings - user.income;
  const remainingSelfIncome = maximumEarnings - user.selfIncome;

  // Increment earnings within the remaining limits
  user.balance += Math.min(30, remainingBalance);
  user.income += Math.min(30, remainingIncome);
  user.selfIncome += Math.min(30, remainingSelfIncome);

  // Update the lastUpdated field to the current date
  user.lastUpdated = currentDate;

  await user.save();

  if (user.is_active) {
    let sponsor = await User.findOne({ userId: user.sponsorId });
    let sponsorCount = await User.countDocuments({ userId: user.sponsorId, is_active: true });

    if (sponsor && sponsorCount >= 2 && sponsor.is_active) {
      sponsor.balance += 4;
      sponsor.teamIncome += 4;
      sponsor.income += 4;
      await sponsor.save();

      let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });

      if (sponsor2 && sponsor2.is_active) {
        let sponsor2CountUser = await User.countDocuments({ sponsorId: sponsor2.userId, is_active: true });

        if (sponsor2CountUser >= 2) {
          sponsor2.teamIncome += 3;
          sponsor2.balance += 3;
          sponsor2.income += 3;
          await sponsor2.save();

          let sponsor3 = await User.findOne({ userId: sponsor2.sponsorId });

          if (sponsor3 && sponsor3.is_active) {
            let sponsor3CountUser = await User.countDocuments({ sponsorId: sponsor2.userId, is_active: true });

            if (sponsor3CountUser >= 3) {
              sponsor3.balance += 2;
              sponsor3.teamIncome += 2;
              sponsor3.income += 2;
              await sponsor3.save();

              let sponsor4 = await User.findOne({ userId: sponsor3.sponsorId });

              if (sponsor4 && sponsor4.is_active) {
                let sponsor4CountUser = await User.countDocuments({ sponsorId: sponsor3.userId, is_active: true });

                if (sponsor4CountUser >= 4) {
                  sponsor4.balance += 1;
                  sponsor4.teamIncome += 1;
                  sponsor4.income += 1;
                  await sponsor4.save();

                  let sponsor5 = await User.findOne({ userId: sponsor4.sponsorId });

                  if (sponsor5 && sponsor5.is_active) {
                    let sponsor5CountUser = await User.countDocuments({ sponsorId: sponsor4.userId, is_active: true });

                    if (sponsor5CountUser >= 5) {
                      sponsor5.balance += 1;
                      sponsor5.teamIncome += 1;
                      sponsor5.income += 1;
                      await sponsor5.save();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  res.send("Account increased successfully");
});

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}



router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post('/profileUpdate',auth, async (req, res) => {
  // const {id}= req.params;

  try {
    const user = await User.findById(req.user.id);
    // const user = await User.findById({_id : id});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }
    if (req.body.accountHolderName) {
      user.accountHolderName = req.body.accountHolderName.trim();
    }

    if (req.body.bio) {
      user.bio = req.body.bio.trim();
    }
    if (req.body.address) {
      user.address = req.body.address.trim();
    }
    if (req.body.accountNo) {
      user.accountNo = req.body.accountNo.trim();
    }
    if (req.body.ifscCode) {
      user.ifscCode = req.body.ifscCode.trim();
    }
     //For google Pay
     if (req.body.GPay) {
      const GPay = req.body.GPay.trim();
      const GPayExists = await User.findOne({ GPay });
      if (GPayExists && GPayExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Gpay number already exists' });
      }
      user.GPay = GPay;
    }
    // if (req.body.mobile) {
    //   const mobile = req.body.mobile.trim();
    //   const mobileExists = await User.findOne({ mobile });
    //   if (mobileExists && mobileExists._id.toString() !== user._id.toString()) {
    //     return res.status(400).json({ error: 'Mobile number already exists' });
    //   }
    //   user.mobile = mobile;
    // }
if (req.body.aadhar) {
      const aadhar = req.body.aadhar.trim();
      const aadharExists = await User.findOne({ aadhar });
      if (aadharExists && aadharExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Aadhar number already exists' });
      }
      user.aadhar = aadhar;
    }
    // if (req.body.email) {
    //   const email = req.body.email.trim().toLowerCase();
    //   const emailExists = await User.findOne({ email });
    //   if (emailExists && emailExists._id.toString() !== user._id.toString()) {
    //     return res.status(400).json({ error: 'Email already exists' });
    //   }
    //   user.email = email;
    // }
    user.updateCount += 1;

    // Mark details as updated
    if(user.updateCount ===3){
      user.detailsUpdated = true;
    }
    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    // console.error(error.message);
    res.status(500).send('Server Error for updation');
  }
});

router.post('/activeuser/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    
    let user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find the active user based on userId: sponsorId
    const sponsor = await User.find({ userId: user.sponsorId });

    // Count the number of active users based on sponsorId
    // let spnosorCount = await User.countDocuments({ userId: user.sponsorId, is_active: true });
    const sponsorCount = await User.countDocuments({ sponsorId: user.userId, is_active: true });
    const sponsor1 = await User.find({ sponsorId: user.userId, is_active: true });
    const sponsorTotalCount = await User.countDocuments({ sponsorId: user.userId });

    // Count the number of active users based on sponsor.sponsorId
    const sponsor2Count = await User.countDocuments({sponsorId: sponsorCount, is_active: true });

    // Count the number of active users based on sponsor2.sponsorId
    const sponsor3Count = await User.countDocuments({ sponsorId: sponsor2Count, is_active: true });

    // Count the number of active users based on sponsor3.sponsorId
    const sponsor4Count = await User.countDocuments({ sponsorId: sponsor3Count?.sponsorId, is_active: true });

    const data = {
      // activeUser: user,
      sponsor1,
      sponsorCount,
      sponsorTotalCount,
      sponsor2Count,
      sponsor3Count,
      sponsor4Count,
    };

    // console.log(data);

    res.json(data);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to get a user's sponsors
router.get('/sponsors', async (req, res) => {
  try {
    const {userId } = req.query;

    // Find the user's sponsor
    const user = await User.findOne({userId }).select('activationTime createdAt name usesrId income balance withdrawal selfIncome teamIncome rewards accountNo ifscCode GPay');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all sponsors
    // const sponsors = await User.find({ sponsorId: user.userId });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to fetch the number of users created each day within the last 30 days
router.get('/api/users-created', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userCounts = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedData = userCounts.map((entry) => ({
      date: entry._id,
      count: entry.count,
    }));

    res.json(formattedData);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/new/users-created', async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const userCounts = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedData = userCounts.map((entry) => ({
      date: `${entry._id.year}-${entry._id.month}`,
      count: entry.count,
    }));

    res.json(formattedData);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
