const { Message, EmbedBuilder, Guild } = require("discord.js");
const guildSettings = require("../models/guildSettings");

Guild.prototype.fetchDB = async function (guildID = {}) {
  if (!guildID || isNaN(guildID)) {
    guildID = this.id;
  }
  let data = await guildSettings.findOne({ guildId: guildID });
  // return data;

  if (data === null) {
    let newdata = await guildSettings.create({
      guildId: this.id,
      prefix: client.config.app.px,
    });
    newdata.save();
    let data = await guildSettings.findOne({ guildId: guildID });
    return data;
  } else {
    return data;
  }
};

exports.getData = async (guildId) => {
  const data = guildSettings.findOne({ guildId : guildId})
  return data;
}
