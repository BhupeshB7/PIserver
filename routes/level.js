

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// router.post("/updateWallet/:userId", async (req, res) => {
//   const { userId } = req.params;
//   let user = await User.findOne({ userId: userId });
//   if (!user) {
//     return res.status(404).send("User not found");
//   }

//   user.balance += 30;
//   user.income += 30;
//   user.selfIncome += 30;
//   await user.save();

//   let sponsor = await User.findOne({ userId: user.sponsorId });
//   let sponsorCount = await User.countDocuments({ userId: user.sponsorId, is_active:true  })
//   if (sponsor && sponsorCount >= 1) {
//     sponsor.balance += 4;
//     sponsor.teamIncome += 4;
//     sponsor.income += 4;
//     await sponsor.save();

//     let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });

//     if (sponsor2) {
//       // let sponsor2CountUser = await User.countDocuments({ sponsorId: sponsor2.userId });
//       let sponsor2CountUser = await User.distinct('userId', { sponsorId: sponsor2.userId }).countDocuments();
//       if (sponsor2CountUser >= 2) {
//         sponsor2.teamIncome += 3;
//         sponsor2.balance += 3;
//         sponsor2.income += 3;
//         await sponsor2.save();

//         let sponsor3 = await User.findOne({ userId: sponsor2.sponsorId });

//         if (sponsor3) {
//           let sponsor3CountUser = await User.countDocuments({ sponsorId: sponsor2.userId, is_active:true  });

//           if (sponsor3CountUser >= 3) {
//             sponsor3.balance += 2;
//             sponsor3.teamIncome += 2;
//             sponsor3.income += 2;
//             await sponsor3.save();

//             let sponsor4 = await User.findOne({ userId: sponsor3.sponsorId });

//             if (sponsor4) {
//               let sponsor4CountUser = await User.countDocuments({ sponsorId: sponsor3.userId });

//               if (sponsor4CountUser >= 4) {
//                 sponsor4.balance += 1;
//                 sponsor4.teamIncome += 1;
//                 sponsor4.income += 1;
//                 await sponsor4.save();

//                 let sponsor5 = await User.findOne({ userId: sponsor4.sponsorId });

//                 if (sponsor5) {
//                   let sponsor5CountUser = await User.countDocuments({ sponsorId: sponsor4.userId });

//                   if (sponsor5CountUser >= 5) {
//                     sponsor5.balance += 1;
//                     sponsor5.teamIncome += 1;
//                     sponsor5.income += 1;
//                     await sponsor5.save();
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   res.send("Account increased successfully");
// });



async function apiRateLimitMiddleware(req, res, next) {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId: userId }).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const lastApiCallTimestamp = user.lastApiCallTimestamp;

    if (!lastApiCallTimestamp || now - lastApiCallTimestamp >=  12*60 * 60 * 1000) {
    // if (!lastApiCallTimestamp || now - lastApiCallTimestamp >= 12 * 60 * 60 * 1000) {
      // If the user is allowed to make the API call, update the lastApiCallTimestamp
      user.lastApiCallTimestamp = now;
      await user.save();
      next();
    } else {
      // If the user is not allowed, return an error message
      return res.status(429).json({ error: 'API rate limit exceeded' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
router.post("/updateWallet/:userId",apiRateLimitMiddleware,  async (req, res) => {
  const { userId } = req.params;
  let user = await User.findOne({ userId: userId });
  if (!user) {
    return res.status(404).send("User not found");
  }

  user.balance += 30;
  user.income += 30;
  user.selfIncome += 30;
  await user.save();

  if (user.is_active) {
    let sponsor = await User.findOne({ userId: user.sponsorId });
    let sponsorCount = await User.countDocuments({ userId: user.sponsorId, is_active: true });

    if (sponsor && sponsorCount >= 1 && sponsor.is_active) {
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


module.exports = router;
