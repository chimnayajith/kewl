const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder,  PermissionsBitField} = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
      .setName('lockdown')
      .setDescription('Locks the Channel')
      .addStringOption(option =>
            option.setName('choice')
                .setDescription('True to place lockdown & False to lift lockdown')
                .setRequired(true)
                .addChoices({name:'True' , value: 'true'},
                            {name:'False', value: 'false'})),

    async execute(client, interaction) {
        try {
            const no_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ You do not have the `Manage Channel` permission!")
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({embeds : [no_perm] , ephemeral : true})

            const input =  interaction.options.get('choice').value

            const mod_log = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
                .setURL('https://beatsmusic.ga')
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                .setTimestamp()
            
            const mod_log_channnel = interaction.guild.channels.cache.get(client.config.bot.modlogid)    
            if (input === 'true') {

                const already_locked  = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀Channel is already locked for @everyone!')
                if(!interaction.guild.roles.everyone.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.SendMessages)) return interaction.reply({embeds:[already_locked] , ephemeral : true})

                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });

                const locked = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:lockdown:1004800749965951087>⠀|⠀<#${interaction.channel.id}> has been **locked**!!`)
                        // .setFooter({ text: ` ${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true })})
                        // .setAuthor({name:` ${interaction.user.tag}`,iconURL: interaction.member.displayAvatarURL({ dynamic: true })})
                        
                interaction.reply({embeds : [locked]})

                mod_log.addFields(
                    {name:  'Action⠀⠀⠀⠀⠀⠀',value:`**Lockdown**`,inline:true},
                    {name:  'Locked Channel⠀⠀⠀',value:`<#${interaction.channel.id}>`,inline:true},
                    {name:  'Locked by⠀⠀⠀⠀⠀⠀',value:`\`${interaction.user.tag}\``,inline:true},
                    {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
                )

                mod_log_channnel.send({embeds:[mod_log]})
            } else if (input === 'false'){

                const already_unlocked  = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀Channel is already un-locked for @everyone!')
                if(interaction.guild.roles.everyone.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.SendMessages)) return interaction.reply({embeds:[already_unlocked] , ephemeral : true})
                
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
                const unlocked = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:lockdown:1004800749965951087>⠀|⠀<#${interaction.channel.id}> has been **unlocked**!!`)
                interaction.reply({embeds : [unlocked]})

                mod_log.addFields(
                    {name:  'Action',value:`**Un-Lockdown**`,inline:true},
                    {name:  'UnLocked Channel',value:`<#${interaction.channel.id}>`,inline:true},
                    {name:  'UnLocked by',value:`\`${interaction.user.tag}\``,inline:true},
                    {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
                )

                mod_log_channnel.send({embeds:[mod_log]})
            }
        } catch (e) {
            console.log(e)
              return interaction.channel.send(`${e.message}`)
          }
    }

}