const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder , PermissionsBitField} = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
      .setName('nickname')
      .setDescription('Change nickname of a user in the server')
      .addUserOption(option =>option.setName('user').setDescription('User to change nickname').setRequired(true))
      .addStringOption(option => option.setName('nickname').setDescription('New nickname').setRequired(true)),

      async execute(client, interaction) {
        try {
            const user = interaction.options.getUser('user');
            const nickname =  interaction.options.getString('nickname')

            const nick_change = await interaction.guild.members.fetch(user.id).catch(err => {})

            const no_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ You do not have the `Manange Nicknames` permission!")
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return interaction.reply({embeds : [no_perm] , ephemeral : true})
            
            const cannot_change = new EmbedBuilder().setColor("#2f3136").setDescription("<:failed:941027474106613791> ⠀|⠀Cannot set or change nickname of this user")
            if (nick_change.roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) >= 0) return interaction.reply({embeds:[cannot_change],ephemeral : true})

            nick_change.setNickname(nickname)

            const nick_changed = new EmbedBuilder().setColor("#2f3136").setDescription(`<:ticck:929033546377609216>⠀|⠀Changed **${user.tag}**'s nickname to **${nickname}**`)
            interaction.reply({embeds : [nick_changed]})

            const mod_log = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
                .setURL('https://beatsmusic.ga')
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    {name:  'Action⠀⠀⠀⠀⠀⠀',value:`**Set Nickaname**`,inline:true},
                    {name:  'User⠀⠀⠀',value:`\`${user.tag}\``,inline:true},
                    {name:  'Moderator⠀⠀⠀',value:`\`${interaction.user.tag}\``,inline:true},
                    {name:  'New Nickname⠀⠀⠀',value:`\`${nickname}\``,inline:true},
                    {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                .setTimestamp()

            const mod_log_channnel = interaction.guild.channels.cache.get(client.config.bot.modlogid)   

            mod_log_channnel.send({embeds:[mod_log]})
            
        } catch (e) {
            console.log(e)
              return interaction.channel.send(`${e.message}`)
          }
      }
}