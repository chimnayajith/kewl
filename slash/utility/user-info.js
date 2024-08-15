    const { SlashCommandBuilder } = require('@discordjs/builders');
    const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder , PermissionsBitField} = require('discord.js');

    module.exports =  {
        data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Shows information about a user')
        .addUserOption(option =>option.setName('user').setDescription('User').setRequired(false)),

        
        async execute(client, interaction) {
            try {
                user = interaction.options.getUser("user") || interaction.user
                const member = await interaction.guild.members.fetch(user.id)
                
                //selected permissions to display
                var select_perms =[];
                const permissions = member.permissions.toArray()
                const needed_perms = ['Administrator' , 'KickMembers' , 'BanMembers' ,  'ManageMessages', 'ManageNicknames', 'MentionEveryone' , 'ManageChannels' , 'ManageGuild']
                permissions.forEach(i=> {if(needed_perms.includes(i)) return select_perms.push(i.replace(/[A-Z]/g, ' $&').trim())})

                //to get all the roles of the member
                var roles = []
                member.roles.cache.map(i => roles.push(`<@&${i.id}>⠀`))

                //to get the status of the member
                activity_types = ['Playing','Streaming'	,'Listening' , 'Watching' , 'Custom' , 'Competing']
                const presence =  member.presence.activities.length !== 0 ? activity_types[member.presence.activities[0].type] + ' : ' + member.presence.activities[0].name : '\`No active status.\`'

                const whois = new EmbedBuilder().setColor('#2f3136').setTitle(user.tag).setThumbnail(member.displayAvatarURL())
                        .setTitle(`User Info : ${user.username}⠀⠀⠀⠀⠀⠀⠀⠀⠀`)
                        .addFields(
                            {
                                name : "User ID",
                                value : `${user.id}`,
                                inline:true
                            },
                            {
                                name : "Username",
                                value: `${user.tag}`,
                                inline : true
                            },
                            {
                                name : `Nickname`,
                                value : `${member.nickname || "\`No nickname\`"}`,
                                inline : true
                            },
                            {
                                name : "Created on",
                                value : `:calendar_spiral: <t:${Math.round(user.createdTimestamp / 1000)}:D>\n\`${Math.floor(((Date.now() - user.createdTimestamp) / 1000) / (60*60*24*30.5))} months,${Math.floor((((Date.now() - user.createdTimestamp) / 1000) / (60 * 60 *  24 )) %30.5)} days ago\``,
                                inline:true
                            },
                            {
                                name: " Joined Server",
                                value : `:calendar_spiral: <t:${Math.round ( member.joinedTimestamp / 1000) }:D>\n\`${Math.floor(((Date.now() - member.joinedTimestamp) / 1000) / (60*60*24*30.5))} months,${Math.floor((((Date.now() - member.joinedTimestamp) / 1000) / (60 * 60 *  24 )) %30.5)} days ago\``,
                                inline:true
                            },
                            {
                                name : "Permissions",
                                value : `\`\`\`${select_perms.toString()}\`\`\``,
                                inline: false
                            },
                            {
                                name : "Roles",
                                value : roles.slice(0 , -1).toString() || `\`None\``,
                                inline : false
                            },
                            {
                                name : `Status`,
                                value : presence,
                                inline : true
                            },
                            {
                                name : `\u200B`,
                                value : `\u200B`,
                                inline : true
                            },
                            {
                                name : "Bot?",
                                value : user.bot ? `Yes` : `No`,
                                inline : true
                            },
                            )
                interaction.reply({embeds : [whois]})
            } catch (e) {
                console.log(e)
                interaction.channel.send(e.message)
            }
        }
    }