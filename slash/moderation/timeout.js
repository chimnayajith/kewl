const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const ms = require('ms');


module.exports =  {
    data: new SlashCommandBuilder()
      .setName('timeout')
      .setDescription('Timeout a User')
      .addUserOption(option =>option.setName('user').setDescription('User to be timeouted').setRequired(true))
      .addStringOption(option =>
        option.setName('duration')
          .setDescription('Duration the User is timeouted.')
          .setRequired(true)
          .addChoices({name:'60 seconds',value: `1 min`}, 
                      {name :'5 minutes', value:`5 min`},
                      {name :'10 minutes', value:`10 min`},
                      {name :'1 hour', value:`1 hour`},
                      {name :'1 day', value:`1 day`},
                      {name :'1 week',value: `7 days`})
          )
        .addStringOption(option => option.setName('reason').setDescription("Reason the user is timeouted").setRequired(false)),
      
      async execute(client, interaction) {
        try{
        const user = interaction.options.getUser('user');
        const durationoption = interaction.options.get('duration').value
        const reason =  interaction.options.getString('reason')
        duration = ms(durationoption)

        const mutee = await interaction.guild.members.fetch(user.id).catch(console.error);// || await interaction.guild.members.fetch(user.id).catch(err => {})

        const notinguild = new EmbedBuilder().setColor('#2f3136').setDescription('** <:failed:941027474106613791> ⠀|⠀User not in this Server! **')
        if(!mutee) return interaction.reply({embeds:[notinguild],ephemeral :true})

        const yourself = new EmbedBuilder().setColor('#2f3136').setDescription('**<:failed:941027474106613791>⠀|⠀You cannot timeout yourself!**')
        if (mutee === interaction.member) return interaction.reply({embeds:[yourself],ephemeral :true})

        const cannotmute = new EmbedBuilder().setColor('#2f3136').setDescription('**<:failed:941027474106613791>  ⠀|⠀Cannot Timeout User!**')
        if (mutee.roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) >= 0) return interaction.reply({embeds:[cannotmute],ephemeral : true})

        const alreadytimeout = new EmbedBuilder().setColor("#2f3136").setDescription('**<:failed:941027474106613791>⠀|⠀User is Already Timeouted!**')
        if (mutee.isCommunicationDisabled()) return interaction.reply({embeds:[alreadytimeout],ephemeral:true})

        const canttimeout = new EmbedBuilder().setColor('#2f3136').setDescription('**<:failed:941027474106613791> ⠀|⠀Can\'t timeout  user!**')
        if (!mutee.moderatable) return interaction.reply({embeds : [canttimeout],ephemeral:true})
  

        const confirmation = new EmbedBuilder().setColor('#2f3136').setTitle('Timeout Confirmation')
        .addFields(
          {name : '<:user:940844698166263828> Target:' , value : `\`${mutee.user.tag}\``},
          {name : `<:time:941949081465528350> Duration:`, value : `\`${durationoption}\``},
          {name : `<:rightSort:941015879129387018> Reason:` , value : `\`${reason || "No Reason Provided" }\`` }
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
      
        const muteedm = new EmbedBuilder()
          .setColor('#2f3136')
          .setAuthor({name:`You have been timeouted in ${interaction.guild.name}`,iconURL: interaction.guild.iconURL()})
          .setDescription(`<:user:940844698166263828> **Member: ** ${mutee.user.tag} \n<:time:941949081465528350> **Duration: ** ${durationoption}\n<:rightSort:941015879129387018> **Reason: ** ${reason || "No Reason Provided"}`)
        
        const success = new EmbedBuilder().setColor('#00FF00').setDescription(`<:ticck:929033546377609216>⠀|⠀**${mutee.user.tag}** has been timeouted for \`${durationoption}\``)
        
        let embed = new EmbedBuilder()
          .setColor('#2f3136')
          .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
          .setURL('https://beatsmusic.ga')
          .addFields(
            {name:  'Action',value:`**Timeout**`,inline:true},
            {name:  'Timeouted User',value:`\`${mutee.user.tag}\``,inline:true},
            {name:  'Duration',value:`\`${durationoption}\``,inline:true},
            {name:  'Reason',value:`\`${reason || "No Reason Provided"}\``,inline:true},
            {name:  'Timeouted By',value:`\`${interaction.user.username}\``,inline:true},
            {name:  'Date',value:`\`${interaction.createdAt.toLocaleString()}\``,inline:true},
        )
          .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
          .setTimestamp()

        var sChannel = interaction.guild.channels.cache.get(client.config.bot.modlogid)
        if (!sChannel) return;
        const collector =  msg.createMessageComponentCollector({
          time : 30000,
          componentType: 2
      })
        collector.on("collect", async (collected) => {
          const value = collected.customId
          await collected.deferUpdate();
          if (collected.user.id !== interaction.user.id) return collected.followUp({ content: `:x:  |  That command wasnt for you `,ephemeral :true });
          if(value === "confirm") {
            mutee.timeout(duration ,reason ).then(() => {
                collected.editReply({embeds:[success],components:[]}).then(message => setTimeout(() => message.delete(), 20000));
                mutee.send({embeds:[muteedm]}).catch(() => null)
                sChannel.send({embeds:[embed]})
            })
        }
        else if (value === "cancel"){
          confirmation.setTitle("Timeout Cancelled")
          collected.editReply({embeds:[confirmation] , components:[disabledrow], ephemeral : false}).then(message => setTimeout(() => message.delete(), 20000));
        }
          
          })

          collector.on("end" ,async (c,reason)=> {
            if (reason === 'time'){
            confirmation.setTitle("Timeout Cancelled")
            msg.edit({embeds :[confirmation], components: [disabledrow] }).then(message => setTimeout(() => message.delete(), 20000));;
            }
        })
        } catch (e){
          console.log(e)
          interaction.channel.send(e.message)
        }
      }
    }

