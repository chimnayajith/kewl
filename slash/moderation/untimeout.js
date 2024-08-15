const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder} = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
      .setName('untimeout')
      .setDescription('Removes Timeout of a user')
      .addUserOption(option =>option.setName('user').setDescription('User to be banned').setRequired(true)),
    //   .setDefaultPermission(true),
      
      async execute(client, interaction) {
        try{
        const user = interaction.options.getUser('user');
        
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})

        const not_timeouted = new EmbedBuilder().setColor('#2f3166').setDescription('<:failed:941027474106613791> ⠀|⠀User is not timeouted!')
        if(!member.isCommunicationDisabled()) return interaction.reply({embeds : [not_timeouted] , ephemeral : true})

        const un_timeouted = new EmbedBuilder().setColor('#00ff00').setDescription(`**<:ticck:929033546377609216>⠀|⠀${user.tag} has been un-timeouted**`)
        member.disableCommunicationUntil(null)    
        interaction.reply({embeds : [un_timeouted] , fetchReply : true}).then(i => setTimeout(() => i.delete(), 20000));

        const to_user = new EmbedBuilder().setColor('#2f3136').setDescription(`<:user:940844698166263828>⠀|⠀You have been un-timeouted in - **${interaction.guild.name}**`)
        member.send({embeds:[to_user]}).catch(() => null)

        let embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
        .setURL('https://beatsmusic.ga')
        .addFields(
            {name:  'Action',value:`**Un-Timeout**`,inline:true},
            {name:  'User',value:`\`${member.user.tag}\``,inline:true},
            {name:  'User ID',value:`\`${member.user.id}\``,inline:true},
            {name:  'Moderator',value:`\`${interaction.user.username}\``,inline:true},
            {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
        )
        .setFooter({text: `${interaction.guild.name}`,iconURL: interaction.guild.iconURL()})
        .setTimestamp();

        var sChannel = interaction.guild.channels.cache.get(client.config.bot.modlogid)
        sChannel.send({embeds:[embed]})

        } catch(err){
            console.log(err)
        }
    }
}