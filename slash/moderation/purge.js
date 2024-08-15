const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder , PermissionsBitField} = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
      .setName('purge')
      .setDescription('Delete large amount of messages')
      .addIntegerOption(option =>option.setName('amount').setDescription('Deletes the specified number of messages').setRequired(true))
      .addUserOption(option =>option.setName('user').setDescription('Deletes messages from a specific user').setRequired(false)),

      async execute(client, interaction) {
        try {
            const amount = interaction.options.getInteger('amount')
            const user = interaction.options.getUser('user')

            const no_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ You do not have the `Manage Messages` permission!")
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({embeds : [no_perm] , ephemeral : true})

            const bot_perm = new EmbedBuilder().setColor(`#2f3136`).setDescription("<:failed:941027474106613791> ⠀|⠀ Bot does not have the `Manage Messages` permission!")
            if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({embeds : [bot_perm] , ephemeral : true})

            if (!user) {
                const deleted = new EmbedBuilder().setColor("2f3136").setDescription(`<:ticck:929033546377609216>⠀|⠀${amount} messages deleted!`)
                interaction.channel.bulkDelete(amount)
                interaction.reply({embeds : [deleted] , fetchReply : true}).then(i => setTimeout(() => i.delete(), 5000));
            } else {
                const delete_member = await interaction.guild.members.fetch(user.id).catch(err => {})

                const cannot_delete = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791>  ⠀|⠀Cannot delete messages from this user!')
                if (delete_member.roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) >= 0) return interaction.reply({embeds:[cannot_delete],ephemeral : true})
                if (delete_member.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) return interaction.reply({embeds:[cannot_delete],ephemeral : true})

                const msgs = [];
                interaction.channel.messages.fetch({limit: 100 }).then((messages) => { 
                    messages.filter(m => m.author.id === user.id).forEach(msg => msgs.push(msg))
                    interaction.channel.bulkDelete(msgs.slice(0,amount))
                })
                
                const deleted = new EmbedBuilder().setColor("2f3136").setDescription(`<:ticck:929033546377609216>⠀|⠀Deleted ${amount} messages from ${user.tag}!`)
                interaction.reply({embeds: [deleted] , fetchReply : true}).then(i => setTimeout(() => i.delete(), 5000));
            }
        } catch(e) {
            console.log(e)
            interaction.channel.send(e.message)
        }
      }
}