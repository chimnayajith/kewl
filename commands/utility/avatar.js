const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    utilisation: '{prefix}avatar [user]',

    execute(client, message) {
        let user = message.mentions.users.first() || message.author

        const avatar =  new EmbedBuilder().setColor('#2f3136').setTitle(`${user.username}'s Avatar`).setImage(user.avatarURL({size : 1024}))
        .setFooter({text : `Requested By ${message.author.tag}` , iconURL: message.author.avatarURL()})
        .setDescription(`[WEBP](${user.avatarURL()})  |  [PNG](${user.avatarURL({extension : 'png'})})  |  [JPG](${user.avatarURL({extension : 'jpg'})})`)

        message.reply({embeds : [avatar] , allowedMentions: { repliedUser: false }})
    },
};