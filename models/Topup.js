const mongoose = require('mongoose')

const topupSchema =new mongoose.Schema({
 
    userID :{
        type:String
    },
    activationTime: {
        type: Date,
        default: null
      },
      depositAmount:{
        type:Number
      }
},{
    timestamps:true
})

module.exports = mongoose.model('Topup', topupSchema)