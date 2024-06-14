// server/models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  videoLink: {
    type: String,
    // required: true,
  },
  watched: {
    type: Boolean,
    default: false
  },
  locked: {
    type: Boolean,
    default: false
  }
},
{timestamps:true}
);

module.exports = mongoose.model('Tasks2', taskSchema);

// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   videoLink: {
//     type: String,
//     required: true
//   },
//   completed: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     completionStatus: {
//       type: Boolean,
//       default: false
//     }
//   }],
//   watchedBy: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     videoLocked: {
//       type: Boolean,
//       default: true
//     }
//   }]
// });

// const Task = mongoose.model('Task', taskSchema);

// module.exports = Task;
