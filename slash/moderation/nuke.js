const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder , PermissionsBitField, Embed} = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
      .setName('nuke')
      .setDescription('Nuke the current channel'),

      async execute(client, interaction) {
        try {
            const no_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ You need the `Administrator` permission to use this command!")
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({embeds : [no_perm] , ephemeral : true})
            
            const bot_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ The Bot needs `Administrator` permission to use this command!")
            if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({embeds : [bot_perm] , ephemeral : true})

            const confirmation = new EmbedBuilder().setColor("2f3136").setTitle("Nuke Confirmation").setThumbnail('https://cdn.discordapp.com/attachments/1005373315004772424/1005377893502820352/nuke.gif')
                    .setDescription(`Are you sure you want to **nuke** the current channel [ <#${interaction.channel.id}> ]?`)
            const conf_row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel('Confirm').setStyle(3).setCustomId('confirm'),
                new ButtonBuilder().setLabel('Cancel').setStyle(4).setCustomId('cancel')
            )
            const disabled_row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel('Confirm').setStyle(3).setCustomId('confirm').setDisabled(true),
                new ButtonBuilder().setLabel('Cancel').setStyle(4).setCustomId('cancel').setDisabled(true)
            )
            const collect = await interaction.reply({embeds : [confirmation] , components : [conf_row]})

            const collector =  collect.createMessageComponentCollector({
                time : 10000,
                componentType: 2
            })

            const nuked = new EmbedBuilder().setColor('#2f3136').setDescription('**<:nuke:1005371071026966590>⠀⠀⠀|⠀⠀⠀Channel Nuked**')

            const mod_log = new EmbedBuilder()
                .setColor("#2f3136")
                .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
                .setURL('https://beatsmusic.ga')
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                .setTimestamp()

            const mod_log_channel = interaction.guild.channels.cache.get(client.config.bot.modlogid)
            collector.on("collect", async (collected) => {
                const value = collected.customId
                await collected.deferUpdate();
                if (collected.user.id !== interaction.user.id) return collected.followUp({ content: `:x:  |  That command wasnt for you `,ephemeral :true });
                if(value === "confirm") {
                    interaction.channel.clone().then(c => {c.send({embeds:[nuked]})})
                    interaction.channel.delete()
                    mod_log.addFields(
                        {name:  'Action⠀⠀⠀⠀⠀⠀',value:`**Nuke**`,inline:true},
                        {name:  'Nuked Channel⠀⠀⠀⠀⠀⠀',value:`\`${interaction.channel.name}\``,inline:true},
                        {name:  'Moderator',value:`\`${interaction.user.tag}\``,inline:true},
                        {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
                    )
                    mod_log_channel.send({embeds : [mod_log]})
                }
                else if (value === "cancel"){
                    confirmation.setTitle(null).setDescription("<:ticck:929033546377609216>⠀|⠀Nuke Cancelled").setThumbnail(null)
                    collected.editReply({embeds:[confirmation] , components:[], ephemeral : true}).then(message => setTimeout(() => message.delete(), 2000));
                }
            })

            collector.on("end" ,async (collected , reason)=> {
                if (reason === 'time'){
                    confirmation.setTitle(null).setDescription("<:ticck:929033546377609216>⠀|⠀Nuke Cancelled").setThumbnail(null);
                    interaction.deleteReply()
                    // collected.editReply({embeds :[confirmation], components: [disabled_row] }).then(message => setTimeout(() => message.delete(), 2000));
                }
            })

        } catch (e){
            console.log(e)
            return interaction.channel.send(`${e.message}`)
        }
    }
}