const { Client, GatewayIntentBits, Partials } = require("discord.js");
const mongoose = require("mongoose");

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.config = require("./config");

// const antiAd = require('./anti-ad')
// antiAd(client)

require("./src/loader");
require("./src/slashloader");


mongoose
  .connect(
    ""
  )
  .then(() => {
    console.log("Connected to the database  ");
  })
  .catch((err) => {
    console.log(err);
  });

client.login(client.config.app.token);
