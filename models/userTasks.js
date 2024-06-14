// userTasks.js
const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  userId: {
    type:String
  },
  sponsorId: {
    type:String
  },
  mobile: {
    type:String
  },
  name: {
    type:String
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  WalletUpdated: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

const UserTask = mongoose.model('UserTask', userTaskSchema);

module.exports = UserTask;
