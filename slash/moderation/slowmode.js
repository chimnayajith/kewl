const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder , PermissionsBitField} = require('discord.js');
const ms = require('ms');

module.exports =  {
    data: new SlashCommandBuilder()
      .setName('slowmode')
      .setDescription('Enable or Disable the slowmode in a channel')
      .addStringOption(option =>option.setName('timeout').setDescription('Duration of the slowmode [Ex : 1m30s]').setRequired(false))
      .addStringOption(option =>option.setName('state').setDescription('on by default , select off to disable slowmode').setRequired(false)
        .addChoices({name:'on' , value: 'on'},
                    {name:'off', value: 'off'})),
    
    async execute(client, interaction) {
        try {
            const no_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ You do not have the `Manage Channel` permission!")
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({embeds : [no_perm] , ephemeral : true})

            const bot_no_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ I do not have the `Manage Channel` permission!") 
            if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({embeds : [no_perm] , ephemeral : true})

            const timeout = interaction.options.getString('timeout')
            const state = interaction.options.getString('state') || 'on'

            if (!state){state = 'on'}

            const current_cooldown = interaction.channel.rateLimitPerUser;
            
            if (state === 'off') {
                if (current_cooldown === 0 ) {
                    const already_off = new EmbedBuilder().setColor('#2f3136').setDescription('<:ticck:929033546377609216>⠀|⠀Channel slowmode is already turned off.')
                    interaction.reply({embeds : [already_off] , ephemeral : true})
                } else {
                    interaction.channel.setRateLimitPerUser(0)
                    const turned_off  = new EmbedBuilder().setColor('#2f3136').setDescription("<:ticck:929033546377609216>⠀|⠀Channel slowmode has been turned off")
                    interaction.reply({embeds : [turned_off] , fetchReply : true}).then(message => setTimeout(() => message.delete(), 15000));
                }

            } else if ( state === 'on') {
                const no_time = new EmbedBuilder().setColor("2f3136").setDescription("<:failed:941027474106613791> ⠀|⠀ No time has been provided.")
                if(!timeout) return interaction.reply({embeds : [no_time] , ephemeral : true})

                time_in_sec = (ms(timeout))/1000
                const invalid_time = new EmbedBuilder().setColor("2f3136").setDescription("<:failed:941027474106613791> ⠀|⠀ Invalid time format ! Provide valid timeout in the form __1m30s__ or __1h__")
                if (!timeout) return interaction.reply({embeds : [invalid_time] , ephemeral : true})

                interaction.channel.setRateLimitPerUser(time_in_sec)

                const slowmoded = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀Channel slowmode has been set to \`${ms(ms(timeout), {long : true})}\``)
                interaction.reply({embeds : [slowmoded] , fetchReply:true   }).then(message => setTimeout(() => message.delete(), 15000));
            }
        } catch (e) {
            console.log(e)
            interaction.channel.send(e.message)
        }
    }
}

