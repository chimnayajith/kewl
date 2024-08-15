const { Guild } = require("discord.js");
const Warns = require("../models/Warns");

async function addWarn(guildId, userId, warning) {
  
  let data = await warns.findOneAndUpdate(
    {
      guildId: guildId,
      userId: userId,
    },
    { warnings: warning }
  );
  new_data.save();
}
