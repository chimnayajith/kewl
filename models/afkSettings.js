const mongoose = require("mongoose");

const afkSettings = mongoose.Schema({
  userId: {
    type: String,
    required: true,

  },

  afk: {
    type : Boolean,
    required : true,
    default : false
  },

  message :{
    type:String,
    required:false,
  },
  timestamp: {
    type: Number,
    required : false
  }
});

module.exports = mongoose.model("afkSettings", afkSettings);