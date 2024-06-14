const mongoose = require('mongoose')

const topupHistorySchema =new mongoose.Schema({
 
    // name :{
    //     type:String
    // },
    userId :{
        type:String
    },
    targetUserId :{
        type:String
    },
    package:{
        type:Number
    }
},{
    timestamps:true
})

module.exports = mongoose.model('TopupUser', topupHistorySchema)