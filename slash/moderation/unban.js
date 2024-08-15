const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
      .setName('unban')
      .setDescription('Unbans a User')
      .addUserOption(option =>option.setName('user').setDescription('User to be banned').setRequired(true))
      .setDefaultPermission(true),
      
      async execute(client, interaction) {
        try{
        const user = interaction.options.getUser('user');
    //     const command = await client.guilds.cache.get('899195708626849802')?.commands.fetch('929781699842310154');
    //     const permissions = [
    //       {
    //           id: '891581154765979668',
    //           type: 'USER',
    //           permission: true,
    //       }
    //   ];
    //   await command.permissions.add({ permissions });
      let bannedMember;
      let bannedMemberInfo = await interaction.guild.bans.fetch();
      bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === user.username.toLocaleLowerCase()) || bannedMemberInfo.get(user) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === user.username.toLocaleLowerCase());
      const valid = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀Provide a valid username and tag or User ID or The user is not banned')
    if (!bannedMember) return interaction.reply({embeds:[valid],ephemeral:true})

    try {
        interaction.guild.members.unban(bannedMember.user.id)
        var sembed = new EmbedBuilder().setColor("#00FF00").setDescription(`**<:ticck:929033546377609216>⠀|⠀${bannedMember.user.tag} has been unbanned.**`)
        interaction.reply({embeds:[sembed]}).then(message => setTimeout(() => message.delete(), 20000));

        } catch {
            
        }

        let embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setThumbnail(bannedMember.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
        .setURL('https://beatsmusic.ga')
        .addFields(
            {name:  'Action',value:`**Unban**`,inline:true},
            {name:  'Unbanned User',value:`\`${bannedMember.user.tag}\``,inline:true},
            {name:  'User ID',value:`\`${bannedMember.user.id}\``,inline:true},
            {name:  'Moderator',value:`\`${interaction.user.username}\``,inline:true},
            {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
        )
        .setFooter({text: `${interaction.guild.name}`,iconURL: interaction.guild.iconURL()})
        .setTimestamp();

     var sChannel = interaction.guild.channels.cache.get(client.config.bot.modlogid)
     sChannel.send({embeds:[embed]})
        } catch(e) {
            console.log(e)
            return interaction.reply(`${e.message}`)
        }
    }
}