const ms = require('ms');
const { SlashCommandBuilder , EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Latency of the bot'),

    execute(client, interaction) {
        const ping_embed = new EmbedBuilder().setColor(`#2f3136`).setTitle('Pong! :ping_pong: ').setDescription(`Latency of the bot : **${client.ws.ping} ms**`)
        interaction.reply({embeds:[ping_embed]});
    },
};