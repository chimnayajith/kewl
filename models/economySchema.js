const mongoose = require('mongoose')

const economySchema = mongoose.Schema({
    userId :{
        type: String,
        required : true,
        unique: true
    },
    coins :{
        type :Number , 
        default : 500 
    },
    bank :{
        type :Number , 
        default : 0 
    },
    lastDaily :{
        type: Number,
        default : 0
    }
})

module.exports = mongoose.model('economySchema' , economySchema)