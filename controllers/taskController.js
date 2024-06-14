
// taskController.js
const User = require("../models/User");
const Task = require("../models/newTask");
const UserTask = require("../models/userTasks");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};

const createTask = async (req, res) => {
  const { title, videoLink } = req.body;

  try {
    const newTask = await Task.create({ title, videoLink });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a task" });
  }
};
//last updated code

const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Fetch the task based on taskId
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Fetch all userTasks associated with the given taskId
    const userTasks = await UserTask.find({ taskId });

    // Check if all users have completed the task
    const allUsersCompleted = userTasks.every((userTask) => userTask.completed);

    if (allUsersCompleted) {
      // If all users have completed the task, show userTasks array as empty
      task.userTasks = userTasks.map((userTask) => ({
        userId: userTask.userId,
        completed: userTask.completed,
      }));
      // task.userTasks = [];
    } else {
      // If there are userTasks, show the userTasks array with the information
      task.userTasks = [];
    }

    res.status(200).json(task);
  } catch (error) {
    // console.error(error); // Log the error for debugging purposes
    res
      .status(500)
      .json({ error: "Failed to retrieve the task. Please try again later." });
  }
};

const markTaskCompleted = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.body.userId; // Assuming you send userId in the request body
  const sponsorId = req.body.sponsorId; // Assuming you send userId in the request body
  const name = req.body.name;
  const mobile = req.body.mobile;
  try {
    // Check if the userTask already exists, if not, create a new entry
    let userTask = await UserTask.findOne({
      taskId,
      userId,
      sponsorId,
      mobile, 
      name,
    });
    // console.log(userId);
    if (!userTask) {
      await UserTask.create({
        taskId,
        userId,
        sponsorId,
        mobile,
        name,
        completed: true,
        WalletUpdated: false,
      });
    }

    // Retrieve the userTask again (or the newly created one)
    userTask = await UserTask.findOne({ taskId, userId });

    if (!userTask) {
      return res.status(404).send("UserTask not found");
    }
    if (userTask.WalletUpdated) {
      return res.status(400).send("Wallet already Updated");
    }
    // Check if the task is completed
    if (userTask.completed) {
      // Mark the task as completed
      userTask.completed = true;
      // Check if all tasks are completed for the user
      //  const allTasksCompleted = await UserTask.find({ userId, completed: false }).countDocuments() === 0;

      // Update WalletUpdated to true
      userTask.WalletUpdated = true;

      await userTask.save();

      // Update user's balance, income, and selfIncome
      let user = await User.findOne({ userId: userId });
      if (!user) {
        return res.status(404).send("User not found");
      }
      // Calculate and update dailyIncome
      // Get the current date and time
      let currentDate = new Date();

      // // Convert to IST (Indian Standard Time)
      // let options = { timeZone: "Asia/Kolkata" };
      // let currentISTTime = currentDate.toLocaleString("en-US", options);

      // console.log("Current time in IST:", currentISTTime);

      // console.log(currentDate);
      // console.log(user.lastIncomeUpdate);

      // // Format user.lastIncomeUpdate in IST
      // let lastIncomeUpdateIST = user.lastIncomeUpdate
      //   ? user.lastIncomeUpdate.toLocaleString("en-US", options)
      //   : null;

      // // Check if it's a new day
      // if (
      //   !lastIncomeUpdateIST ||
      //   lastIncomeUpdateIST.slice(0, 10) !== currentISTTime.slice(0, 10)
      // ) {
      //   // Reset dailyIncome to 0 if it's a new day
      //   user.dailyIncome = 0;
      //   console.log("Resetting dailyIncome to 0");
      // } else {
      //   console.log("It's the same day");
      // }
      // console.log("CurrentIST time in India:",currentISTTime)

      // user.balance += 25;
      // user.income += 25;
      // user.selfIncome += 25;
      // user.dailyIncome += 25;
      // user.lastIncomeUpdate = currentISTTime; //
      // console.log("CurrentIST time:",currentISTTime)
      if (user.package === 500||user.package===499) {
        user.balance += 20;
        user.income += 20;
        user.selfIncome += 20;
        user.dailyIncome += 20;
        user.lastIncomeUpdate = currentDate; //
      }
      else if(user.package ===1000||user.package===999){
       user.balance += 50;
       user.income += 50;
       user.selfIncome += 50;
       user.dailyIncome += 50;
       user.lastIncomeUpdate = currentDate; //
      }
      await user.save();
      if (user.is_active) {
        let sponsor = await User.findOne({ userId: user.sponsorId });
        // let sponsorTest = await User.find({ sponsorId: sponsor.userId }).select("name userId sponsorId");
        // console.log(sponsor);
        // console.log(sponsorTest)
        let sponsorDownCount = await User.countDocuments({
          sponsorId: sponsor.userId,
          is_active: true,
        });
        console.log(user.sponsorId);
        console.log("Total Count");
        console.log("Level1");
        console.log(sponsorDownCount);
        if (sponsor && sponsorDownCount >= 2 && sponsor.is_active) {
          sponsor.balance += 4;
          sponsor.teamIncome += 4;
          sponsor.dailyIncome += 4;
          sponsor.teamIncomeValidation += 4;
          sponsor.lastIncomeUpdate = currentDate; //
          await sponsor.save();

          let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });

          if (sponsor2 && sponsor2.is_active) {
            let sponsor2DownCount = await User.countDocuments({
              sponsorId: sponsor2.userId,
              is_active: true,
            });
            // console.log(sponsor2);
            // console.log("Total Count");
            // console.log("Level1");
            // console.log(sponsor2DownCount);
            if (sponsor2DownCount >= 4) {
              sponsor2.teamIncome += 3;
              sponsor2.balance += 3;
              sponsor2.income += 3;
              sponsor2.dailyIncome += 3;
              sponsor2.teamIncomeValidation += 3;
              sponsor2.lastIncomeUpdate = currentDate; //
              await sponsor2.save();

              let sponsor3 = await User.findOne({ userId: sponsor2.sponsorId });

              if (sponsor3 && sponsor3.is_active) {
                let sponsor3CountUser = await User.countDocuments({
                  sponsorId: sponsor3.userId,
                  is_active: true,
                });
                // console.log(user.sponsorId);
                // console.log("Level1");
                // console.log("Total Count");
                // console.log(sponsor3CountUser);
                if (sponsor3CountUser >= 6) {
                  sponsor3.balance += 2;
                  sponsor3.teamIncome += 2;
                  sponsor3.income += 2;
                  sponsor3.dailyIncome += 2;
                  sponsor3.teamIncomeValidation += 2;
                  sponsor3.lastIncomeUpdate = currentDate; //
                  await sponsor3.save();

                  let sponsor4 = await User.findOne({
                    userId: sponsor3.sponsorId,
                  });

                  if (sponsor4 && sponsor4.is_active) {
                    let sponsor4CountUser = await User.countDocuments({
                      sponsorId: sponsor4.userId,
                      is_active: true,
                    });

                    if (sponsor4CountUser >= 8) {
                      sponsor4.balance += 1;
                      sponsor4.teamIncome += 1;
                      sponsor4.income += 1;
                      sponsor4.dailyIncome += 1;
                      sponsor4.teamIncomeValidation += 1;
                      sponsor4.lastIncomeUpdate = currentDate; //
                      await sponsor4.save();

                      let sponsor5 = await User.findOne({
                        userId: sponsor4.sponsorId,
                      });

                      if (sponsor5 && sponsor5.is_active) {
                        let sponsor5CountUser = await User.countDocuments({
                          sponsorId: sponsor5.userId,
                          is_active: true,
                        });

                        if (sponsor5CountUser >= 10) {
                          sponsor5.balance += 1;
                          sponsor5.teamIncome += 1;
                          sponsor5.income += 1;
                          sponsor5.dailyIncome += 1;
                          sponsor5.teamIncomeValidation += 1;
                          sponsor5.lastIncomeUpdate = currentDate; //
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
      // Additional logic for updating sponsors and their incomes goes here
      // console.log("Update");
      res.send("Account increased successfully");
    } else {
      // console.log("error");
      res.send("All Task has been not updated successfully");
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Failed to mark the task as completed" });
  }
};

module.exports = {
  markTaskCompleted,
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndDelete(taskId);
    // Delete userTask entries for the deleted task
    await UserTask.deleteMany({ taskId });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the task" });
  }
};
const deleteAllTasks = async (req, res) => {
  try {
    // Delete all tasks
    await Task.deleteMany({});
    // Delete all userTask entries related to the deleted tasks
    await UserTask.deleteMany({});
    res.status(200).json({ message: "All tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete all tasks" });
  }
};
// const  taskStatus =( async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const userTaskStatus = {};

//     // Loop from level 0 to level 5
//     for (let level = 0; level <= 5; level++) {
//       // Check if there is a task entry for the given level and userId
//       const taskEntry = await UserTask.findOne({
//         userId: mongoose.Types.ObjectId(userId),
//         taskId: mongoose.Types.ObjectId(level),
//       });

//       // Determine completion status for the level
//       if (taskEntry) {
//         userTaskStatus[`level${level}`] = 'complete';
//       } else {
//         userTaskStatus[`level${level}`] = 'not complete';
//       }
//     }

//     res.json(userTaskStatus);
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Error fetching user task status' });
//   }
// });
const taskStatus = async (userId, level) => {
  if (level > 5) {
    // Base case: reached the maximum level, return "completed" as default
    return "completed";
  }

  try {
    // Convert the level to ObjectId using the correct factory function from Mongoose
    const levelObjectId = mongoose.Types.ObjectId(level.toString());

    // Check if there is a task entry for the given level and userId
    const taskEntry = await UserTask.findOne({
      userId: mongoose.Types.ObjectId(userId),
      taskId: levelObjectId,
    });

    // Determine completion status for the level
    if (taskEntry) {
      // If the user has completed the task for this level, move on to the next level
      return taskStatus(userId, level + 1);
    } else {
      // If the user has not completed the task for this level, return "pending"
      return "pending";
    }
  } catch (error) {
    // console.log(error);
    throw new Error("Error fetching user task status");
  }
};

// Usage example:
const getUserTaskStatus = async (userId) => {
  try {
    // Start with level 0
    const level = 0;
    const status = await taskStatus(userId, level);
    return { status };
  } catch (error) {
    // console.log(error);
    throw new Error("Error fetching user task status");
  }
};

// API endpoint
const taskCompletionStatus = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userTaskStatus = await getUserTaskStatus(userId);
    res.json(userTaskStatus);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user task status" });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  markTaskCompleted,
  deleteTask,
  deleteAllTasks,
  taskCompletionStatus,
};
