const { EmbedBuilder , Permissions , ActionRowBuilder} = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'timeout',
    aliases: [],
    utilisation: '{prefix}timeout',

    async execute(client, message,args) {
        try {
            //Fetching prefix of the guild
            let guildDB = await message.guild.fetchDB();
            const prefix = guildDB.prefix ;

            //User does not have Manage Guild permission
            const perm_denied = new EmbedBuilder().setColor('#2f3136').setDescription("<:failed:941027474106613791> ⠀|⠀ You don't have permission to Timeout users!")
            if (!message.member.permissions.has(Permissions.MANAGE_GUILD)) return message.channel.send({embeds:[perm_denied]}).then(msg => { setTimeout(() => msg.delete(), 10000) })

            //User to be timouted is not specified
            const missing_user = new EmbedBuilder().setColor('#2f3136').setTitle('<:failed:941027474106613791> ⠀|⠀ Provide a user to be Timeouted!').setDescription(`*Use the format ${prefix}timeout [user] [time] (reason)*`)
            if (!args[0]) return message.channel.send({embeds:[missing_user]}).then(msg => { setTimeout(() => msg.delete(), 10000) })

            //Time to be timeouted is not specifies
            const missing_time = new EmbedBuilder().setColor('#2f3136').setTitle('<:failed:941027474106613791> ⠀|⠀ Provide time to be Timeouted!').setDescription(`*Use the format ${prefix}timeout [user] [time] (reason)*`)
            if (!args[1]) return message.channel.send({embeds:[missing_time]}).then(msg => { setTimeout(() => msg.delete(), 10000) })

            var time = args[1]
            const invalid_time = new EmbedBuilder().setColor('#2f3136').setTitle('<:failed:941027474106613791> ⠀|⠀ Time provided is invalid!').setDescription('*Available time options are `1m`,`5m`,`10m`,`1h`,`1d`,`7d`*')
            if (!(time in ['1m' , '5m' , '10m' , '1h' , '1d' , '7d' ])) return message.channel.send({embeds:[invalid_time]})

            var reason = args.slice(2).join(" ");
            
            var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            
            //Specified user is not a valid user
            const valid = new EmbedBuilder().setColor('#2f3136').setTitle('<:failed:941027474106613791> ⠀|⠀ Enter A Valid User To Be Muted!')
            if (!mutee) return message.channel.send({embeds:[valid]}).then(msg => { setTimeout(() => msg.delete(), 10000) });

            //the specified user is the author
            const yourself = new EmbedBuilder('#2f3136').setTitle('<:failed:941027474106613791> ⠀|⠀ You cannot Mute Yourself!')
            if (mutee === message.member) return message.channel.send({embeds:[yourself]}).then(msg => { setTimeout(() => msg.delete(), 10000) })

            //User had higher role than the bot
            const cannotmute = new EmbedBuilder().setColor('#2f3136').setTitle('<:failed:941027474106613791> ⠀|⠀ Cannot Mute this User!')
            if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send({embeds:[cannotmute]}).then(msg => { setTimeout(() => msg.delete(), 10000) })

            //Specified user is a bot
            const cannotmutebots = new EmbedBuilder().setColor('#2f3136').setTitle('<:failed:941027474106613791> ⠀|⠀ Cannot Mute Bots!')
            if (mutee.user.bot) return message.channel.send({embeds:[cannotmutebots]}).then(msg => { setTimeout(() => msg.delete(), 10000) })  

            //User already timeouted
            const alreadytimeout = new EmbedBuilder().setColor("#2f3136").setTitle('**<:failed:941027474106613791>⠀|⠀User is Already Timeouted!**')
            if (mutee.isCommunicationDisabled()) return message.channel.send({embeds:[alreadytimeout]}).then(msg => { setTimeout(() => msg.delete(), 10000) })

            const confirmation = new EmbedBuilder().setColor('#2f3136').setTitle('Timeout Confirmation')
                .addFields(
                {name : '<:user:940844698166263828> Target:' , value : `\`${mutee.user.tag}\``},
                {name : `<:time:941949081465528350> Duration:`, value : `\`${time}\``},
                {name : `<:rightSort:941015879129387018> Reason:` , value : `\`${reason || "No Reason Provided" }\`` }
                )
            const row = new ActionRowBuilder().addComponents(
                new MessageButton()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(3),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(4)
                ) 
            const disabled_row = new ActionRowBuilder().addComponents(
                new MessageButton()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(3)
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(4)
                    .setDisabled(true)
                )

            const msg = await message.channel.send({embeds :[confirmation] , components : [row], fetchReply:true})
            
            const mutee_dm = new MessageEmbed()
                .setColor('#2f3136')
                .setAuthor({name:`You have been timeouted in ${message.guild.name}`,iconURL: message.guild.iconURL()})
                .setDescription(`<:user:940844698166263828> **Member: ** ${mutee.user.tag} \n<:time:941949081465528350> **Duration: ** ${time}\n<:rightSort:941015879129387018> **Reason: ** ${reason || "No Reason Provided"}`)
        
            const success = new MessageEmbed().setColor('GREEN').setDescription(`<:ticck:929033546377609216>⠀|⠀**${mutee.user.tag}** has been timeouted for \`${time}\``)
        
        let embed = new MessageEmbed()
          .setColor('#2f3136')
          .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
          .setTitle('Beats Support⠀|⠀Mod Logs')
          .addFields(
            {name:  'Action',value:`**Timeout**`,inline:true},
            {name:  'Timeouted User',value:`\`${mutee.user.tag}\``,inline:true},
            {name:  'Duration',value:`\`${time}\``,inline:true},
            {name:  'Reason',value:`\`${reason || "No Reason Provided"}\``,inline:true},
            {name:  'Timeouted By',value:`\`${message.author.username}\``,inline:true},
            {name:  'Date',value:`\`${message.createdAt.toLocaleString()}\``,inline:true},
        )
          .setFooter({ text: 'Beats Support', iconURL: message.guild.iconURL()})
          .setTimestamp()

        var sChannel = message.guild.channels.cache.get(client.config.bot.modlogid)
        if (!sChannel) return;

        const collector =  msg.createMessageComponentCollector({
            idle: 30000,
            componentType: 2,
        })
  
        collector.on("collect", async (collected) => {
            const value = collected.customId
            await collected.deferUpdate();
            if (collected.user.id !== message.user.id) return collected.followUp({ content: `:x:  |  That command wasnt for you `,ephemeral :true });
            if(value === "confirm") {
              mutee.timeout(time ,reason ).then(() => {
                  collected.editReply({embeds:[success],components:[]})
                  mutee.send({embeds:[mutee_dm]}).catch(() => null)
                  sChannel.send({embeds:[embed]})
              })
          } else if (value === "cancel"){
            confirmation.setTitle("Timeout Cancelled")
            collected.editReply({embeds:[confirmation] , components:[disabledrow], ephemeral : false})
          }    

            var sChannel = message.guild.channels.cache.get(client.config.bot.modlogid)
            if (!sChannel) return;
            sChannel.send(embed)
    })
}catch (e){
    console.log(e)
    message.channel.send(e.message)
  }
}
}
