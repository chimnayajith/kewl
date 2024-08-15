const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField} = require("discord.js");
const db = require('../../util/economy')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Share your Kewl coins!")
    .addUserOption((option) => option.setName('user').setDescription('User you want to share with').setRequired(true))
    .addNumberOption((option) => option.setName('amount').setDescription('Amount you want to share').setRequired(true)),

    async execute(client, interaction) {
        try {
            const user = interaction.options.getUser('user')
            const amount = interaction.options.getNumber('amount')

            const data = await db.getData(interaction.member.user.id)
            const cur_bal = data.coins

            //Cannot transfer to yourself
            const transfer_to_self = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀You can't transfer to yourself!`)
            if (interaction.member.user.id === user.id) return interaction.reply({embeds : [transfer_to_self] , ephemeral : true})
            
            //Transferring to a bot
            const transfer_to_bot = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀You can't transfer money to a bot!`)
            if (user.bot) return interaction.reply({embeds : [transfer_to_bot] , ephemeral : true})

             //zero cash in hand
             const zero_bal = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ You have \`0\` <:kewl_coin:1013720156247183420>. Use \`daily\` or \`work\` to earn.`)
             if(amount=== 0) return interaction.reply({embeds : [zero_bal] , ephemeral : true});
 
             //insufficient funds
             const insufficient = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ You have less than the given amount. You are ${amount - cur_bal} <:kewl_coin:1013720156247183420> short!`)
             if ( amount > cur_bal) return interaction.reply({embeds : [insufficient] , ephemeral : true});
 
             //transferring funds
             await db.removeCoins(interaction.member.user.id , amount )
             await db.addCoins(user.id , amount)
 
             const transferred = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀You gave **${amount}** <:kewl_coin:1013720156247183420>'s to <@${user.id}>. You now have : \`${cur_bal - amount}\` <:kewl_coin:1013720156247183420>`)
             interaction.reply({embeds : [transferred]})

        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}