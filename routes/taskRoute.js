

// taskRoute.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
// Assume you have User model defined somewhere
const User = require('../models/userTasks'); // Import your User model
const UserTask = require('../models/userTasks');
const NodeCache = require("node-cache");
// Route to get all tasks
router.get('/tasks', taskController.getAllTasks);

// Route to get a single task by taskId
router.get('/tasks/:id', taskController.getTaskById);

// Route to create a new task
router.post('/tasks', taskController.createTask);

// Route to mark a task as completed by taskId
router.patch('/tasks/:id/complete', taskController.markTaskCompleted);

// Route to delete a task by taskId
router.delete('/tasks/:id', taskController.deleteTask);
// New route to delete all tasks
router.delete('/tasks', taskController.deleteAllTasks);
// Route to fetch task Report 
router.get('/user/:userId/taskStatus',taskController.taskCompletionStatus)

// New team task report code
router.get('/pi2/NewTeamTaskReport/:userId', async (req, res) => {
  try {
      const { userId, level } = req.params;
      const users = await fetchUsersByLevel(userId, level);
      const userData = await Promise.all(users.map(async (user) => {
          const task = await UserTask.findOne({ userId: user.userId });
          return {
              Name: user.name,
              UserId: user.userId,
              Level: level,
              Mobile: user.mobile,
              Status: task ? task.completed : false
          };
      }));
      res.json(userData);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Function to fetch users by level recursively
async function fetchUsersByLevel(userId, level) {
  if (level <= 0) return [];
  const users = await User.find({ sponsorId: userId });
  const nextLevelUsers = [];
  for (const user of users) {
      const nextLevelUsersOfUser = await fetchUsersByLevel(user.userId, level - 1);
      nextLevelUsers.push(...nextLevelUsersOfUser);
  }
  return [...users, ...nextLevelUsers];
}

// New team task report code
router.get('/teamTaskMember/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const teamStructure = await getUserTeam(userId, 6); // Set the depth to 5 levels
    res.json(teamStructure);
  } catch (error) {
    // console.error('Error fetching team structure:', error);
    res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
  }
});
  // new downline code 239-299
  const cache = new NodeCache({ stdTTL: 60 }); // Set cache TTL to 60 seconds (adjust as needed)

  router.get('/teamTaskReport/:userId', async (req, res) => {
    const { userId } = req.params;
    const cachedData = cache.get(userId);
  
    if (cachedData) {
      // console.log("Serving from cache");
      res.json(cachedData);
    } else {
      try {
        const teamStructure = await getUserTeamStructure(userId, 6);
        const usersByLevel = countUsersByLevel(teamStructure);
        cache.set(userId, usersByLevel); // Cache the data
        res.json(usersByLevel);
      } catch (error) {
        // console.error('Error fetching team structure:', error);
        res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
      }
    }
  });
  async function getUserTeam(userId, depth) {
    try {
      if (depth <= 0) {
        // If depth reaches 0, return null to stop recursion
        return null;
      }
  
      const user = await UserTask.findOne({ userId }).select('userId completed name mobile sponsorId ').lean();
  
      if (!user) {
        return null;
      }
  
      const activeStatus = user.completed ? 'completed':'unCompleted';
      const teamStructure = {
        level: 6-depth,
        userId: user.userId,
        status: activeStatus,
        name: user.name,
        sponsorId: user.sponsorId,
        mobile: user.mobile,
        downlineCount: 0,
        allUsersCount: 0,
        downline: [],
      };
  
      const downlineUsers = await UserTask.find({ sponsorId: userId }).lean();
      const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId, depth - 1)); // Decrement depth in recursive call
      const downlineTeam = await Promise.all(downlinePromises);
  
      // Remove null elements from downlineTeam array
      const filteredDownlineTeam = downlineTeam.filter((item) => item !== null);
  
      teamStructure.downline = filteredDownlineTeam;
      teamStructure.downlineCount = filteredDownlineTeam.length;
     
      // Count number of all users and active users
      teamStructure.allUsersCount = filteredDownlineTeam.reduce((count, downline) => count + downline.allUsersCount + 1, 0);
     
      return teamStructure;
    } catch (error) {
      // console.error('Error fetching user:', error);
      throw error;
    }
  }
  
  async function getUserTeamStructure(userId, depth) {
    try {
      if (depth <= 0) {
        // If depth reaches 0, return null to stop recursion
        return null;
      }
  
      const user = await User.findOne({ userId }).select('userId completed').lean();
  
      if (!user) {
        return null;
      }
  
      const activeStatus = user.completed ?'completed':'unCompleted';
      const teamStructure = {
        level: 6 - depth,
        userId: user.userId,
        status: activeStatus,
        downline: [],
      };
  
      const downlineUsers = await UserTask.find({ sponsorId: userId }).lean();
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
  
      const status = node.status === 'completed' ? 'completed' : 'unCompleted';
      result[`${node.level}`] = (result[`${node.level}`] || { completed: 0, unCompleted: 0 });
      result[`${node.level}`][status]++;
  
      node.downline.forEach((child) => traverse(child));
    }
  
    traverse(teamStructure);
    return result;
  }
  
module.exports = router;

