// const cron = require("node-cron");
// const ThreeMinuteColorGame = require("../models/ThreeMinuteColorPredict");
// const threeMinuteGameHistory = require("../models/ThreeMinuteGameHistory");
// const ThreeMinuteGameResult = require("../models/ThreeMinuteGameResult");
// const ThreeMinuteHistory = require("../models/ThreeMinuteGameHistory");
// const threeMinuteGameRecord = require("../models/ThreeMGameHistory");
// const GameProfile = require("../models/GameProfile");
// // const GameProfile = require("../models/GameProfile");
// // async function getNextSessionId() {
// //   const lastSession = await ThreeMinuteColorGame.findOne(
// //     {},
// //     {},
// //     { sort: { sessionId: -1 } }
// //   );

// //   if (lastSession) {
// //     const lastSessionId = lastSession.sessionId;
// //     const lastSessionNumber = parseInt(lastSessionId.substring(6), 10);
// //     const nextSessionNumber = lastSessionNumber + 1;
// //     const nextSessionId = `PI243${nextSessionNumber
// //       .toString()
// //       .padStart(4, "0")}`;
// //     return nextSessionId;
// //   } else {
// //     return "PI2430001";
// //   } 
// // }

// async function getNextSessionId() {
//   const lastSession = await ThreeMinuteColorGame.findOne(
//     {}, 
//     {},
//     { sort: { sessionId: -1 } }
//   );

//   if (lastSession) {
//     const lastSessionId = lastSession.sessionId;
//     const lastSessionNumber = parseInt(lastSessionId.substring(6), 10);
//     const nextSessionNumber = lastSessionNumber + 1;
//     const nextSessionId = `PI243${nextSessionNumber
//       .toString()
//       .padStart(6, "0")}`; // Update padStart to 6 characters
//     return nextSessionId;
//   } else {
//     return "PI243000001";
//   } 
// }

// async function createSession3(req, res) {
//   try {
//     const sessionId = await getNextSessionId();
//     const newSession = new ThreeMinuteColorGame({ sessionId, time: 3 });
//     await newSession.save();
//     res.send("New session created successfully");
//     console.log("New session created successfully");
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// }

// async function getLatestSession3(req, res) {
//   try {
//     const latestSession = await ThreeMinuteColorGame.findOne(
//       {},
//       {},
//       { sort: { _id: -1 } }
//     );

//     if (latestSession) {
//       res.json({
//         sessionId: latestSession.sessionId,
//         time: latestSession.time,
//       });
//     } else {
//       res.json({ sessionId: "", time: 0 });
//     }
//   } catch (error) {
//     // console.error("Error fetching latest session info:", error);
//     res.status(500).send("Internal Server Error");
//   }
// }
// async function insertOneMinuteHistory3(req, res) {
//   try {
//     const {
//       betAmount,
//       userChoice,
//       sessionId,
//       userChoiceNumber,
//       userChoiceLetter,
//       userId,
//     } = req.body;
//     const threeMinuteGameHistorySave = new ThreeMinuteHistory({
//       sessionId: sessionId,
//       betAmount: betAmount,
//       userChoice: userChoice,
//       userChoiceNumber: userChoiceNumber,
//       userChoiceLetter: userChoiceLetter,
//       userId: userId,
//     });
//     await threeMinuteGameHistorySave.save();
//     res.status(200).json({ success: true, message: "SuccessFully Created" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error });
//     throw error;
//   }
// }
// //
// const getRandomValue = (array) => {
//   const randomIndex = Math.floor(Math.random() * array.length);
//   return array[randomIndex];
// };
// const generateAndSaveRandomData = async (sessionIds) => {
//   try {
//     // Fetch oneMinuteHistory for the given sessionIds
//     const history = await threeMinuteGameHistory.find({
//       sessionId: { $in: sessionIds },
//     });

//     // Calculate the total betAmount for small and big choices
//     const smallBetAmount = history
//       .filter(
//         (entry) =>
//           entry.userChoiceLetter &&
//           entry.userChoiceLetter.toLowerCase() === "small"
//       )
//       .reduce((acc, entry) => acc + parseFloat(entry.betAmount), 0);

//     const bigBetAmount = history
//       .filter(
//         (entry) =>
//           entry.userChoiceLetter &&
//           entry.userChoiceLetter.toLowerCase() === "big"
//       )
//       .reduce((acc, entry) => acc + parseFloat(entry.betAmount), 0);

//     // console.log("Small Bet Amount:", smallBetAmount);
//     // console.log("Big Bet Amount:", bigBetAmount);

//     // Determine randomLetter based on the lowest total betAmount
//     // const randomLetter = smallBetAmount <= bigBetAmount ? "small" : "big";
//     // Check for tie condition
//     let randomLetter;
//     if (smallBetAmount === bigBetAmount) {
//       // console.log("It's a tie!");
//       // If it's a tie, set randomLetter to a random value
//       const options = ["small", "big"];
//       randomLetter = getRandomValue(options);
//       // console.log("Random Letter (Tie):", randomLetter);
//     } else {
//       // Determine randomLetter based on the lowest total betAmount
//       randomLetter = smallBetAmount < bigBetAmount ? "small" : "big";
//       // console.log("Random Letter:", randomLetter);
//     }

//     // Determine randomNumber based on randomLetter
//     const randomNumber =
//       randomLetter === "small"
//         ? getRandomValue(["0", "1", "2", "3", "4"])
//         : getRandomValue(["5", "6", "7", "8", "9"]);

//     // Determine randomColor
//     // Calculate the total betAmount for each color
//     const redBetAmount = history
//       .filter(
//         (entry) => entry.userChoice && entry.userChoice.toLowerCase() === "red"
//       )
//       .reduce((acc, entry) => acc + parseFloat(entry.betAmount), 0);

//     const greenBetAmount = history
//       .filter(
//         (entry) =>
//           entry.userChoice && entry.userChoice.toLowerCase() === "green"
//       )
//       .reduce((acc, entry) => acc + parseFloat(entry.betAmount), 0);

//     const violetBetAmount = history
//       .filter(
//         (entry) =>
//           entry.userChoice && entry.userChoice.toLowerCase() === "violet"
//       )
//       .reduce((acc, entry) => acc + parseFloat(entry.betAmount), 0);

//     // console.log("Red Bet Amount:", redBetAmount);
//     // console.log("Green Bet Amount:", greenBetAmount);
//     // console.log("Violet Bet Amount:", violetBetAmount);

//     // Determine randomColor based on the smallest betAmount
//     let randomColor;

//     if (redBetAmount < greenBetAmount && redBetAmount < violetBetAmount) {
//       randomColor = "red";
//     } else if (
//       greenBetAmount < redBetAmount &&
//       greenBetAmount < violetBetAmount
//     ) {
//       randomColor = "green";
//     } else if (
//       violetBetAmount < redBetAmount &&
//       violetBetAmount < greenBetAmount
//     ) {
//       randomColor = "violet";
//     } else if (
//       redBetAmount === 0 &&
//       greenBetAmount === 0 &&
//       violetBetAmount === 0
//     ) {
//       // In case of a tie, randomly select one color
//       const colors = ["red", "green", "violet"];
//       randomColor = getRandomValue(colors);
//     } else {
//       // In case of a tie, randomly select one color from the tied colors
//       const tiedColors = [];

//       if (redBetAmount === greenBetAmount) tiedColors.push("red", "green");
//       if (redBetAmount === violetBetAmount) tiedColors.push("red", "violet");
//       if (greenBetAmount === violetBetAmount)
//         tiedColors.push("green", "violet");

//       randomColor = tiedColors.length > 0 ? getRandomValue(tiedColors) : "red"; // Default to "red" in case of no tie
//     }

//     // Generate the session information
//     const newData = new ThreeMinuteGameResult({
//       color: randomColor,
//       letter: randomLetter,
//       number: randomNumber,
//       sessionIds: sessionIds,
//     });

//     await newData.save();
//   } catch (error) {
//     // console.error("Error generating and saving random data:", error);
//     throw error;
//   }
// };
// async function getTimer3(req, res) {
//   const sessionId = req.params.sessionId;
//   try {
//     const timer = await ThreeMinuteColorGame.findOne({ sessionId }).select(
//       "updatedAt time"
//     );

//     if (!timer || !timer.updatedAt) {
//       return res.status(200).json({ time: 0 });
//     }

//     const currentTime = Date.now();
//     const scheduledDeletionTime =
//       timer.updatedAt.getTime() + timer.time * 60 * 1000;
//     const remainingTimeInSeconds = Math.max(
//       0,
//       Math.floor((scheduledDeletionTime - currentTime) / 1000)
//     );
//     res.status(201).json({ time: remainingTimeInSeconds });
//   } catch (error) {
//     // console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
// const processGame = async (req, res) => {
//     try {
//       const { sessionId, userId } = req.body;
  
//       const gameResult = await ThreeMinuteGameResult.findOne({ sessionId: sessionId });
//       const history = await ThreeMinuteHistory.findOne({
//         sessionId: sessionId,
//         userId: userId,
//       });
//       const user = await GameProfile.findOne({ userId: userId });
//       const amount = history.betAmount;
//       let betAmount = 0;
//       let conditionMatched = false;
//       if (
//         history.userChoiceLetter.toLowerCase() === gameResult.letter.toLowerCase() ||
//         history.userChoiceLetter.toLowerCase() === gameResult.letter.toLowerCase()
//       ) {
//         betAmount += history.betAmount * 2;
//         user.totalwin += betAmount;
//         await user.save();
//         try {
//           const result = new threeMinuteGameRecord({
//             sessionId: sessionId,
//             betAmount: amount,
//             userChoice: history.userChoiceLetter,
//             winningChoice: history.userChoiceLetter,
//             userId:history.userId,
//             result:'success'
//           });
//           await result.save();
//         } catch (error) {
//           throw error;
//         }
//          conditionMatched = true;
//       }
  
//     else  if (history.userChoice.toLowerCase() === gameResult.color.toLowerCase()) {
//         betAmount += history.betAmount * 2;
//         user.totalwin += betAmount;
//         await user.save();
//          conditionMatched = true;
//         try {
//           const result = new threeMinuteGameRecord({
//             sessionId: sessionId,
//             betAmount: amount,
//             userChoice: history.userChoice,
//             winningChoice: history.userChoice,
//             userId:history.userId,
//             result:'success'
//           });
//           await result.save();
//         } catch (error) {
//           throw error;
//         }
  
//       }
  
//     else  if (history.userChoiceNumber === gameResult.number) {
//         betAmount += history.betAmount * 3;
//         user.totalwin += betAmount;
//         await user.save();
//          conditionMatched = true;
//         try {
//           const result = new threeMinuteGameRecord({
//             sessionId: sessionId,
//             betAmount: amount,
//             userChoice: history.userChoiceNumber,
//             winningChoice: history.userChoiceNumber,
//             userId:history.userId,
//             result:'succes'
//           });
//           await result.save();
//         } catch (error) {
//           throw error;
//         }
//       } else {
//         userChoice = history.userChoiceLetter || history.userChoiceNumber || history.userChoice;
//         if(userChoice === history.userChoiceLetter) {
//           try {
//             const result = new threeMinuteGameRecord({
//               sessionId: sessionId,
//               betAmount: amount,
//               userChoice: history.userChoiceLetter,
//               winningChoice: gameResult.letter,
//               userId:history.userId,
//               result:'failed'
//             });
//             await result.save();
//           } catch (error) {
//             throw error;
//           }
//         }else if(userChoice === history.userChoiceNumber) {
//           try {
//             const result = new threeMinuteGameRecord({
//               sessionId: sessionId,
//               betAmount: amount,
//               userChoice: history.userChoiceNumber,
//               winningChoice: gameResult.number,
//               userId:history.userId,
//               result:'failed'
//             });
//             await result.save();
//           } catch (error) {
//             throw error;
//           }
//         }else{
//           if(userChoice === history.userChoice) {
//             try {
//               const result = new threeMinuteGameRecord({
//                 sessionId: sessionId,
//                 betAmount: amount,
//                 userChoice: history.userChoice,
//                 winningChoice: gameResult.color,
//                 userId:history.userId,
//                 result:'failed'
//               });
//               await result.save();
//             } catch (error) {
//               throw error;
//             }
//           }
//         }
       
//       }
  
//       res.json({ betAmount });
//     } catch (error) {
//       // console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
//   //Game history
//   const getGameHistory = async (req, res) => {
//     const perPage = 15;
//     const page = req.query.page || 1;
  
//     try {
//       const data = await ThreeMinuteGameResult.find({})
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * perPage)
//         .limit(perPage);
  
//       const totalDocuments = await ThreeMinuteGameResult.countDocuments();
//       const totalPages = Math.ceil(totalDocuments / perPage);
  
//       res.json({
//         data,
//         totalPages,
//         currentPage: page,
//       });
//     } catch (error) {
//       // console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
// async function getTimerf(sessionId) {
//   try {
//     const timer = await ThreeMinuteColorGame.findOne({ sessionId }).select(
//       "updatedAt time"
//     );

//     if (!timer || !timer.updatedAt) {
//       return res.status(200).json({ time: 0 });
//     }

//     const currentTime = Date.now();
//     const scheduledDeletionTime =
//       timer.updatedAt.getTime() + timer.time * 60 * 1000;
//     const remainingTimeInSeconds = Math.max(
//       0,
//       Math.floor((scheduledDeletionTime - currentTime) / 1000)
//     );
//     // Check if remaining time is 5 seconds
//     if (remainingTimeInSeconds === 5) {
//       // console.log("Remaining time");
//       // Call generateAndSaveRandomData with the sessionId
//       await generateAndSaveRandomData(sessionId);
//     }
//   } catch (error) {
//     // console.error(error);
//   }
// }

// cron.schedule("*/3 * * * *", async () => {
//   try {
//     const sessionId = await getNextSessionId();
//     const newSession = new ThreeMinuteColorGame({ sessionId, time: 3 });
//     await newSession.save();
//     // console.log("New session created of 3 Minute:", newSession);
//   } catch (error) {
//     console.error("Error creating new session:", error);
//   }
// });


// // Cron job to run the getTimer function with the sessionId from the shared variable
// cron.schedule("* * * * * *", async () => {
//   try {
//     const session = await ThreeMinuteColorGame.findOne(
//       {},
//       {},
//       { sort: { _id: -1 } }
//     );
//     const sessionId = session.sessionId;
//     await getTimerf(sessionId);
//   } catch (error) {
//     throw error;
//   }
// });
// // Schedule delete Game History of 1Minute  using cron
// cron.schedule('59 23 * * *', async () => {
//   try {
//     // Reset dailyIncome for all users
//     await threeMinuteGameRecord.deleteMany({});
//     // console.log('Game Record deleted Successfully');
//   } catch (error) {
//     console.error('Error resetting daily income:');
//     // console.error('Error resetting daily income:', error);
//   }
// }, {
//   timezone: 'Asia/Kolkata', // Set the timezone to IST
// });
// module.exports = {
//   createSession3,
//   getTimer3,
//   getLatestSession3,
//   insertOneMinuteHistory3,
//   processGame,
//   getGameHistory,
//   // getOneMinuteResult,
// };
