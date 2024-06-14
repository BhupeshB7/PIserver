const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcrypt');
const pendingTransferSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  deduction: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  // status: { type: String, default: 'Pending' },
}, {timestamps: true},);
pendingTransferSchema.pre('save', function (next) {
  this.total = this.amount + this.deduction;
  next();
});
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email'
    }
  },
  password: {
    type: String,
    // required: true,
  },
  mobile: {
    type: String,
    // required: true,
    // validate: {
    //   validator: function (v) {
    //     return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
    //   },
    //   message: 'Invalid mobile number'
    // }
  },
  sponsorId: {
    type: String,
    // required: true
  },
  userId: {
    type: String,
    required: true
  },
  bio: {
    type: String,
  },
  address: {
    type: String,
  },
  accountNo: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
  GPay: {
    type: String,
  },
  aadhar: {
    type: String,
  },
  accountHolderName: {
    type: String,
  },
  withdrawalDone: {
    type: Boolean,
    default: false,
  },
  withdrawalDoneFour: {
    type: Boolean,
    default: false,
  },
  withdrawalDoneEight: {
    type: Boolean,
    default: false,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
  verifytoken:{
    type: String,
},
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
},
is_active: { type: Boolean, default: false },
isBlocked: { type: Boolean, default: false },

balance:{type:Number, default:0},
withdrawal:{type:Number, default:0},
selfIncome:{type:Number, default:0},
teamIncome:{type:Number, default:0},
dailyIncome: { type: Number, default: 0 },
teamIncomeValidation:{type:Number,default:0},
lastIncomeUpdate: { type: Date, default: null },
rewards:{type:Number, default:0},
// income:{type:Number, default:0},
 // Define a virtual property to calculate 'income'
 income: {
  type: Number,
  default:0,
  get: function () {
    return this.selfIncome + this.teamIncome + this.rewards;
  },
},
package:{type:Number},
topupWallet: { type: Number, default: 0 },
pendingTransfer: [pendingTransferSchema],
activationTime: {
  type: Date,
  default: null
},
  // Add the new field for tracking lastUpdated date
  lastUpdated: {
    type: Date,
  },
  lastApiCallTimestamp: {
    type: Date,
    default: null,
  },
  detailsUpdated: { type: Boolean, default: false },
  updateCount: { type: Number, default: 0 },
date: {Date},
 }, {timestamps: true},

);
// Define a pre-save hook to update 'income' based on 'selfIncome', 'teamIncome', and 'rewards'
// userSchema.pre('save', function (next) {
//   this.income = this.selfIncome + this.teamIncome + this.rewards;
//   next();
// });


module.exports = mongoose.model('User', userSchema);

