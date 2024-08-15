const ms = require('ms');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: [],
    utilisation: '{prefix}ping',

    execute(client, message) {
        const ping_embed = new EmbedBuilder().setColor(`#2f3136`).setTitle('Pong! :ping_pong: ').setDescription(`Latency of the bot : **${client.ws.ping} ms**`)
        message.channel.send({embeds:[ping_embed]});
    },
};