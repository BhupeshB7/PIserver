// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
// //   videoLink: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'complete'], default: 'pending' },
//   completedAt: { type: Date },
// });

// const Task = mongoose.model('Task5', taskSchema);

// module.exports = Task;

// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   videoLink: {
//     type: String,
//     required: true,                              
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     // required: true,
//   },
//   completedBy: [{
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     taskId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Task',
//       required: true,
//     },
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Task = mongoose.model('Task5', taskSchema);

// module.exports = Task;

// task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoLink: {
    type: String,
    required: true, 
  },
  userTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTask',
  }],
});

const Task = mongoose.model('Task5', taskSchema);

module.exports = Task;















// // import React, { useState, useEffect } from 'react';

// // function TaskItem({ task, userId }) {
// //   const [isComplete, setIsComplete] = useState(false);
// //   const [timer, setTimer] = useState(0); // Initial timer value in seconds
// //   const [isTimerStarted, setIsTimerStarted] = useState(false);

// //   useEffect(() => {
// //     let countdown;

// //     if (isTimerStarted && task.status === 'pending' && task.userId === userId) {
// //       countdown = setInterval(() => {
// //         setTimer((prevTimer) => prevTimer - 1);
// //       }, 1000);
// //     }

// //     return () => {
// //       clearInterval(countdown);
// //     };
// //   }, [isTimerStarted, task.status, task.userId, userId]);

// //   useEffect(() => {
// //     if (timer === 0 && task.status === 'pending' && task.userId === userId) {
// //       completeTask();
// //     }
// //   }, [timer, task.status, task.userId, userId]);

// //   const startTask = () => {
// //     setIsTimerStarted(true);
// //     setTimer(120); // Set the timer value to the





// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   videoLink: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'complete'], default: 'pending' },
//   completedAt: { type: Date },
//   locked: { type: Boolean, default: false }, // New field to track locking status
// });

// const Task = mongoose.model('Task', taskSchema);

// module.exports = Task;






















// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   videoLink: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'complete'], default: 'pending' },
//   completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who completed the task
//   completedAt: { type: Date },
// });

// const Task = mongoose.model('Task5', taskSchema);

// module.exports = Task;
