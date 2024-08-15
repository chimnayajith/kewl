const { EmbedBuilder , Permissions } = require('discord.js');

module.exports = {
    name: 'unban',
    aliases: [],
    utilisation: '{prefix}unban',
    async execute(client, message,args) {
        const noperm = new EmbedBuilder().setColor('#FF0000').setDescription("You don't have permission to unban users!")
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send({embeds:[noperm]});
        const nouser = new EmbedBuilder().setColor('#FF0000').setDescription('Provide a user to Unban!')
        if (!args[0]) return message.channel.send({embeds:[nouser]})

      
        let bannedMemberInfo = await message.guild.bans.fetch();

        let bannedMember;
        bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
        const valid = new EmbedBuilder().setColor('#FF0000').setDescription('Provide a valid username and tag or User ID or The user is not banned')
        if (!bannedMember) return message.channel.send({embeds:[valid]})

        let reason = args.slice(1).join(" ")

       
        try {
            if (reason) {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed = new EmbedBuilder().setColor("#00ff00").setDescription(`**${bannedMember.user.tag} has been unbanned for ${reason}**`)
                message.channel.send({embeds:[sembed]})
            } else {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed2 = new EmbedBuilder().setColor("#00ff00").setDescription(`**${bannedMember.user.tag} has been unbanned**`)
                message.channel.send({embeds:[sembed2]})
            }
        } catch {
            
        }

        let embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setThumbnail(bannedMember.user.displayAvatarURL({ dynamic: true }))
            .setTitle('Beats Support⠀|⠀Mod Logs')
            .addFields(
                {name:  'Action',value:`**Unban**`,inline:true},
                {name:  'Unbanned User',value:`\`${bannedMember.user.tag}\``,inline:true},
                {name:  'USER ID',value:`\`${bannedMember.user.id}\``,inline:true},
                {name:  'Reason',value:`\`${reason || "-"}\``,inline:true},
                {name: 'Moderator',value:`\`${message.author.username}\``,inline:true},
                {name:  'Date',value:`\`${message.createdAt.toLocaleString()}\``,inline:true},
            )
            .setFooter({text: 'Beats Support',iconURL: message.guild.iconURL()})
            .setTimestamp();

         var sChannel = message.guild.channels.cache.get(client.config.bot.modlogid)
         sChannel.send({embeds:[embed]})
    }
}