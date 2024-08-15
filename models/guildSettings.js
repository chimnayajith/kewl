const mongoose = require("mongoose");

const guildSettings = mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },

  prefix: {
    type: String,
    required: true,
  },

  mod_logs :{
    type:Boolean,
    required:true,
    default:true
  },

  mod_log_channel: {
    type: String,
    required: false,
  },

  welcome :{
    type:Boolean,
    required:true,
    default:true
  },
  welcome_channel: {
    type: String,
    required: false,
  },

  welcome_message: {
    type:String,
    reuired:false
  },

  welcome_dm : {
    type:Boolean,
    required:true,
    default:false
  },

  welcome_dm_message :{
    type:String,
    required:false,
  },

  levelup_channel :{
    type:String,
    required : false,
  },
  levelUp_message: {
    type : String,
    required : false,
    default : 'Good Job {user}! You levelled up to Level {level}.'
  }
});

module.exports = mongoose.model("guildSettings", guildSettings);