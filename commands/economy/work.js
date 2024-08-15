const { EmbedBuilder } = require("discord.js");
const discord = require("discord.js");
const db = require("../../util/economy");

module.exports = {
  name: "work",
  aliases: [],
  category: "Economy",
  utilisation: "{prefix}work",

  async execute(client, message, args) {
    try {

    } catch (e) {
      console.log(e);
      message.channel.send(e.message);
    }
  },
};
