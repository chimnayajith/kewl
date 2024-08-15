const mongoose = require('mongoose')

const xpSchema = mongoose.Schema({
    userId :{
        type: String,
        required : true,
    },
    guildId :{
        type: String,
        required : true,
    },
    xp :{
        type :Number , 
        default : 0 
    },
    totalXp :{
        type:Number,
        default : 0
    },
    level :{
        type :Number , 
        default : 1 
    }
})

module.exports = mongoose.model('xpSchema' , xpSchema)