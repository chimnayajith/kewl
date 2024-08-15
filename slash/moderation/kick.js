const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder,PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .addUserOption(option => option.setName('user').setDescription('User to be kicked').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason the user is kicked').setRequired(false)),

        async execute ( client , interaction ) {
            try {

                const user = interaction.options.getUser('user')
                const reason = interaction.options.getString('reason')
                
                const kick_member = await interaction.guild.members.fetch(user.id).catch(err => {})

                const no_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ You do not have the `Kick Members` permission!")
                 if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({embeds : [no_perm] , ephemeral : true})

                const not_in_guild = new EmbedBuilder().setColor('#2f3136').setDescription('** <:failed:941027474106613791> ⠀|⠀User not in this Server! **')
                if (!kick_member) return interaction.reply({embeds : [not_in_guild] , ephemeral : true});

                const kick_yourself = new EmbedBuilder().setColor('#2f3136').setDescription('**<:failed:941027474106613791> ⠀|⠀You cannot kick yourself!**')
                if (kick_member === interaction.member) return interaction.reply({embeds : [kick_yourself] , ephemeral : true});

                const cant_kick = new EmbedBuilder().setColor('#2f3136').setDescription('**<:failed:941027474106613791> ⠀|⠀Cannot kick this user!**')
                if (!kick_member.kickable) return interaction.reply({embeds : [cant_kick] , ephemeral : true});

                const cannot_kick = new EmbedBuilder().setColor('#2f3136').setDescription('**<:failed:941027474106613791>  ⠀|⠀You cannot Kick this User!**')
                if (kick_member.roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) >= 0) return interaction.reply({embeds:[cannot_kick],ephemeral : true});

                const confirmation = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setTitle('Kick Confirmation')
                        .addFields(
                            { name : '<:user:940844698166263828> Target:', value : `\`${user.tag}\``},
                            { name : '<:rightSort:941015879129387018> Reason:' , value : `\`${reason|| "No Reason Provided"}\`` }
                        )
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Confirm')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle(4)
                    )
                const disabledrow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Confirm')
                        .setStyle(3)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle(4)
                        .setDisabled(true)
                    )    

                const msg = await interaction.reply({embeds :[confirmation] , components : [row], fetchReply:true})
                
                const member_dm = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:`You have been kicked from ${interaction.guild.name}`,iconURL: interaction.guild.iconURL()})
                    .setDescription(`<:user:940844698166263828> **Member: ** ${user.tag} \n<:rightSort:941015879129387018> **Reason: ** ${reason || "No Reason Provided"}`)

                const success = new EmbedBuilder().setColor('#00FF00').setDescription(`<:ticck:929033546377609216>⠀|⠀**${user.tag}** has been kicked from the server.`)

                const mod_log = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
                    .setURL('https://beatsmusic.ga')
                    .addFields(
                    {name:  'Action',value:`**Kick**`,inline:true},
                    {name:  'Kicked User',value:`\`${user.tag}\``,inline:true},
                    {name:  'Reason',value:`\`${reason || "No Reason Provided"}\``,inline:true},
                    {name:  'Kicked By',value:`\`${interaction.user.username}\``,inline:true},
                    {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
                )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                    .setTimestamp()
                
                const mod_log_channel = interaction.guild.channels.cache.get(client.config.bot.modlogid)
                if(!mod_log_channel) return;
                
                const collector = msg.createMessageComponentCollector({
                    time : 30000 , 
                    ComponentType:2
                })

                collector.on("collect" , async (collected) => {
                    const value = collected.customId
                    await collected.deferUpdate();

                    if (collected.user.id !== interaction.user.id) return collected.followUp({ content: `:x:  |  That command wasnt for you `,ephemeral :true });
                    
                    if(value === "confirm") {
                        kick_member.kick( reason ).then(() => {
                            collected.editReply({embeds:[success],components:[]}).then(message => setTimeout(() => message.delete(), 20000));
                            kick_member.send({embeds:[member_dm]}).catch(() => null)
                            mod_log_channel.send({embeds:[mod_log]})
                        })
                    } else if (value === "cancel"){

                        confirmation.setTitle("Timeout Cancelled")
                        collected.editReply({embeds:[confirmation] , components:[disabledrow], ephemeral : false}).then(message => setTimeout(() => message.delete(), 20000));
                    }
                })

                collector.on("end" ,async (c, reason)=> {
                    if (reason === 'time'){
                    confirmation.setTitle("Timeout Cancelled")
                    msg.edit({embeds :[confirmation], components: [disabledrow] }).then(message => setTimeout(() => message.delete(), 20000));
                    }
                })
            } catch (e) {
                console.log(e)
                  return interaction.channel.send(`${e.message}`)
              }
        }

}