// const cron = require("node-cron");
// const MinuteColorPredictGame = require("../models/MinuteColorPredictGame");
// const oneMinuteGameHistory = require("../models/OneMinuteHistory");
// const oneMinuteGameResult = require("../models/OneMinuteResult");
// const GameProfile1 = require("../models/GameProfile");
// const oneMinuteGameRecord = require("../models/OneMGameRecord");
// const moment = require("moment");
// // async function getNextSessionId() {
// //   const lastSession = await MinuteColorPredictGame.findOne(
// //     {}, 
// //     {},
// //     { sort: { sessionId: -1 } }
// //   );

// //   if (lastSession) {
// //     const lastSessionId = lastSession.sessionId;
// //     const lastSessionNumber = parseInt(lastSessionId.substring(6), 10);
// //     const nextSessionNumber = lastSessionNumber + 1;
// //     const nextSessionId = `PI241${nextSessionNumber
// //       .toString()
// //       .padStart(4, "0")}`;
// //     return nextSessionId;
// //   } else {
// //     return "PI2410001";
// //   } 
// // }
// async function getNextSessionId() {
//   const lastSession = await MinuteColorPredictGame.findOne(
//     {}, 
//     {},
//     { sort: { sessionId: -1 } }
//   );
//   // const existingUser = await MinuteColorPredictGame.findOne({
//   //   sessionId: lastSession.sessionId,
//   //   createdAt: {
//   //     $gte: moment().subtract(40, 'seconds').toDate()
//   //   }
//   // }).sort({createdAt: -1});

//   // if (existingUser) {
//   //   return   console.log('MinuteColorPredict Game already saved in last 60 seconds');
//   // }

//   if (lastSession) {
//     const lastSessionId = lastSession.sessionId;
//     const lastSessionNumber = parseInt(lastSessionId.substring(6), 10);
//     const nextSessionNumber = lastSessionNumber + 1;
//     const nextSessionId = `PI241${nextSessionNumber
//       .toString()
//       .padStart(6, "0")}`; // Update padStart to 6 characters
//     return nextSessionId;
//   } else {
//     return "PI241000001";
//   } 
// }

// async function createSession(req, res) {
//   try {
//     const sessionId = await getNextSessionId();
//     const newSession = new MinuteColorPredictGame({ sessionId, time: 1 });
//     await newSession.save();
//     res.send("New session created successfully");
//     // console.log("New session created successfully");
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// }

// async function getLatestSession(req, res) {
//   try {
//     const latestSession = await MinuteColorPredictGame.findOne(
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
// async function insertOneMinuteHistory(req, res) {
//   try {
//     const {
//       betAmount,
//       userChoice,
//       sessionId,
//       userChoiceNumber,
//       userChoiceLetter,
//       userId,
//     } = req.body;
//     const oneMinuteGameHistorySave = new oneMinuteGameHistory({
//       sessionId: sessionId,
//       betAmount: betAmount,
//       userChoice: userChoice,
//       userChoiceNumber: userChoiceNumber,
//       userChoiceLetter: userChoiceLetter,
//       userId: userId,
//     });
//     await oneMinuteGameHistorySave.save();
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
// const generateRandomDataController = async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     await generateAndSaveRandomData(sessionId);
//     res.status(200).json({ message: "Random data generated and saved successfully." });
//   } catch (error) {
//     // console.error("Error in generating and saving random data:", error);
//     res.status(500).json({ error: "An internal server error occurred." });
//   }
// };
// const generateAndSaveRandomData = async (sessionId) => {
//   try {
//        // Check if userId exists in last 60 seconds
//        const existingUser = await oneMinuteGameResult.findOne({
//         sessionId,
//         createdAt: {
//           $gte: moment().subtract(60, 'seconds').toDate()
//         }
//       }).sort({createdAt: -1});
  
//       if (existingUser) {
//         return   
//         // console.log('Data  already saved in last 60 seconds');
//       }
//     // Fetch oneMinuteHistory for the given sessionIds
//     const history = await oneMinuteGameHistory.find({
//       sessionId: { $in: sessionId },
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
//     const newData = new oneMinuteGameResult({
//       color: randomColor,
//       letter: randomLetter,
//       number: randomNumber,
//       sessionId: sessionId,
//     });
// // console.log(newData)
//     await newData.save();
//   } catch (error) {
//     // console.error("Error generating and saving random data:", error);
//     throw error;
//   }
// };
// async function getTimer(req, res) {
//   const sessionId = req.params.sessionId;
//   try {
//     const timer = await MinuteColorPredictGame.findOne({ sessionId }).select(
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
// //
// const processGame = async (req, res) => {
//   try {
//     const { sessionId, userId } = req.body;

//     const gameResult = await oneMinuteGameResult.findOne({ sessionId: sessionId });
//      // Check if gameResult is null
//      if (!gameResult) {
//       return res.status(404).json({ error: "Game result not found for the provided sessionId" });
//     }
//     const history = await oneMinuteGameHistory.findOne({
//       sessionId: sessionId,
//       userId: userId,
//     });
//     if(!history){
//       res.status(403).json({success:false,error:"Next ..."})
//     }
//     const user = await GameProfile1.findOne({ userId: userId });
//     const amount = history.betAmount;
//     let betAmount = 0;
//     let conditionMatched = false;
//     if (
//       history.userChoiceLetter.toLowerCase() === gameResult.letter.toLowerCase() 
//     ) {
//       betAmount += history.betAmount * 2;
//       user.totalwin += betAmount;
//       await user.save();
//       try {
//         const result = new oneMinuteGameRecord({
//           sessionId: sessionId,
//           betAmount: amount,
//           userChoice: history.userChoiceLetter,
//           winningChoice: history.userChoiceLetter,
//           userId:history.userId,
//           result:'success'
//         });
//         await result.save();
//       } catch (error) {
//         throw error;
//       }
//        conditionMatched = true;
//     }

//    else if (history.userChoice.toLowerCase() === gameResult.color.toLowerCase()) {
//       betAmount += history.betAmount * 2;
//       user.totalwin += betAmount;
//       await user.save();
//        conditionMatched = true;
//       try {
//         const result = new oneMinuteGameRecord({
//           sessionId: sessionId,
//           betAmount: amount,
//           userChoice: history.userChoice,
//           winningChoice: history.userChoice,
//           userId:history.userId,
//           result:'success'
//         });
//         await result.save();
//       } catch (error) {
//         throw error;
//       }

//     }

//   else  if (history.userChoiceNumber === gameResult.number) {
//       betAmount += history.betAmount * 3;
//       user.totalwin += betAmount;
//       await user.save();
//        conditionMatched = true;
//       try {
//         const result = new oneMinuteGameRecord({
//           sessionId: sessionId,
//           betAmount: amount,
//           userChoice: history.userChoiceNumber,
//           winningChoice: history.userChoiceNumber,
//           userId:history.userId,
//           result:'success',
//         });
//         await result.save();
//       } catch (error) {
//         throw error;
//       }
//     } else {
//       userChoice = history.userChoiceLetter || history.userChoiceNumber || history.userChoice;
//       if(userChoice === history.userChoiceLetter) {
//         try {
//           const result = new oneMinuteGameRecord({
//             sessionId: sessionId,
//             betAmount: amount,
//             userChoice: history.userChoiceLetter,
//             winningChoice: gameResult.letter,
//             userId:history.userId,
//             result:'failed'
//           });
//           await result.save();
//         } catch (error) {
//           throw error;
//         }
//       }else if(userChoice === history.userChoiceNumber) {
//         try {
//           const result = new oneMinuteGameRecord({
//             sessionId: sessionId,
//             betAmount: amount,
//             userChoice: history.userChoiceNumber,
//             winningChoice: gameResult.number,
//             userId:history.userId,
//             result:'failed'
//           });
//           await result.save();
//         } catch (error) {
//           throw error;
//         }
//       }else{
//         if(userChoice === history.userChoice) {
//           try {
//             const result = new oneMinuteGameRecord({
//               sessionId: sessionId,
//               betAmount: amount,
//               userChoice: history.userChoice,
//               winningChoice: gameResult.color,
//               userId:history.userId,
//               result:'failed'
//             });
//             await result.save();
//           } catch (error) {
//             throw error;
//           }
//         }
//       }
     
//     }

//     res.json({ betAmount });
//   } catch (error) {
//     // console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// //Game history
// const getGameHistory = async (req, res) => {
//   const perPage = 15;
//   const page = req.query.page || 1;

//   try {
//     const data = await oneMinuteGameResult.find({})
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * perPage)
//       .limit(perPage);

//     const totalDocuments = await oneMinuteGameResult.countDocuments();
//     const totalPages = Math.ceil(totalDocuments / perPage);

//     res.json({
//       data,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (error) {
//     // console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// async function getTimerf(sessionId) {
//   try {
//     const timer = await MinuteColorPredictGame.findOne({ sessionId }).select(
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
    
//   } catch (error) {
//     // console.error(error);
//   }
// }

// cron.schedule("* * * * *", async () => {
//   try {
//     const sessionId = await getNextSessionId();
//     const newSession = new MinuteColorPredictGame({ sessionId, time: 1 });
//     await newSession.save();
//     // console.log("New session created:", sessionId);
//   } catch (error) {
//     console.error("Error creating new session:", error);
//   }
// });

// // Cron job to run the getTimer function with the sessionId from the shared variable
// cron.schedule("* * * * * *", async () => {
//   try {
//     const session = await MinuteColorPredictGame.findOne(
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
//     await oneMinuteGameRecord.deleteMany({});
//     console.log('Game Record deleted Successfully');
//   } catch (error) {
//     // console.error('Error resetting daily income:', error);
//   }
// }, {
//   timezone: 'Asia/Kolkata', // Set the timezone to IST
// });
// module.exports = {
//   createSession,
//   getTimer,
//   getLatestSession,
//   insertOneMinuteHistory,
//   processGame,
//   getGameHistory,
//   generateRandomDataController
//   // getOneMinuteResult,
// };
