const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageButton, MessageSelectMenu, MessageActionRow } = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Configure the bot.')
    .addStringOption(option => option.setName('prefix').setDescription('Prefix for the server.'))
    .addChannelOption(option => option.setName('welcome').setDescription('Set the channel for welcome message.'))
    .addChannelOption(option => option.setName('mod_log').setDescription('Set the channel for Mod - logs')),
    

       async execute(client, interaction , guildDB) {
        const prefix = interaction.options.getString('prefix');
        const welcome =  interaction.options.getChannel('welcome')
        const mod_log =  interaction.options.getChannel('mod_log')

        if (!guildDB.h24) {
          guildDB.prefix = prefix;
          guildDB.save();
        }
        console.log(prefix , welcome , mod_log)
        }
    }
  