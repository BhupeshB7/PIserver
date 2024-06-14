const UserTask = require('../models/userTasks');

// Endpoint to check if a task is complete for a specific user
const checkTaskCompletion = async (req, res) => {
  const { taskId, userId } = req.params;

  try {
    const userTask = await UserTask.findOne({ taskId, userId });

    if (!userTask) {
      // If userTask not found, it means the user has not completed the task
      return res.status(200).json({ completed: false });
    }

    res.status(200).json({ completed: userTask.completed });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Failed to check task completion' });
  }
};

module.exports = {
  checkTaskCompletion,
};
