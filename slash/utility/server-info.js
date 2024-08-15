const { SlashCommandBuilder } = require('@discordjs/builders');
    const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder , PermissionsBitField} = require('discord.js');

    module.exports =  {
        data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Shows information about the server'),

        
        async execute(client, interaction) {
            try {

                //fetching the guild
                const guild = await interaction.guild.fetch()
                
                //owner tag
                const owner_tag = await guild.members.fetch(guild.ownerId).then(member => member.user.tag)

                //number of humans and bots
                const human = guild.members.cache.filter(member => !member.user.bot).size
                const bots = guild.members.cache.filter(member => member.user.bot).size

                //number of text/voice channels
                const text_channels =  guild.channels.cache.filter(i =>i.type === 0).size
                const voice_channels = guild.channels.cache.filter(i =>i.type === 2).size
                const total_channels = guild.channels.cache.size - guild.channels.cache.filter(i =>i.type === 4).size

                //boost level array for number of boosts needed
                const boosts = [2,7,14]

                //to get all the roles of the guild
                var roles = []
                guild.roles.cache.map(i => roles[i.position] = `<@&${i.id}>⠀`)

                //emojis animated and not animated
                const total_emojis = guild.emojis.cache.size
                const animated_true = guild.emojis.cache.filter(emoji => emoji.animated === true).size

                //total number of invite links created
                const invites = await guild.invites.fetch().then(i => i.size)

                const server_info = new EmbedBuilder().setColor("#2f3136").setTitle(`Server Info : ${guild.name}`).setThumbnail(guild.iconURL())
                        .addFields(
                            {
                                name : 'Server ID⠀⠀⠀',
                                value : guild.id,
                                inline : true
                            },
                            {
                                name : 'Owner⠀⠀⠀',
                                value : `${owner_tag}`,
                                inline : true
                            },
                            {
                                name : 'Created on⠀⠀⠀⠀',
                                value : `:calendar_spiral: <t:${Math.round ( guild.createdTimestamp / 1000) }:D>`,
                                inline : true
                            },
                            {
                                name : `Members (${guild.memberCount})⠀⠀⠀⠀`,
                                value : `>>> ${guild.approximatePresenceCount} online\n${human} humans , ${bots} bots`,
                                inline : true
                            },
                            {
                                name : `Channels (${total_channels})⠀⠀⠀⠀`,
                                value : `>>> Text : ${text_channels}\nVoice : ${voice_channels}`,
                                inline : true
                            },
                            {
                                name : 'Boost⠀⠀⠀⠀',
                                value : `>>> Level : ${guild.premiumTier}\nBoosts : ${guild.premiumSubscriptionCount}/${boosts[guild.premiumSubscriptionCount]}`,
                                inline : true
                            },
                            {
                                name : `Roles (${guild.roles.cache.size})⠀⠀⠀⠀`,
                                value : `Highest: ${roles.at(-1)}`,
                                inline : true
                            },
                            {
                                name : `Emojis⠀⠀⠀` ,
                                value : `>>> Total : ${total_emojis}\nAnimated : ${animated_true}`,
                                inline : true
                            },
                            {
                                name : "Invites⠀⠀⠀⠀",
                                value : `${invites}`,
                                inline : true
                            }
                        )
                interaction.reply({embeds : [server_info]})            
            } catch (e) {
                console.log(e)
                interaction.channel.send(e.message)
            }
        }
    }