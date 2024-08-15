const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField} = require("discord.js");
const db = require('../../util/economy')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw Kewl-coins from your bank")
    .addStringOption((option) => option.setName('amount').setDescription('Amount to withdraw `[amount/all]`').setRequired(true)),

    async execute(client, interaction) {
        try {
          const amount = interaction.options.getString('amount')

          const invalid = new EmbedBuilder().setColor('#2f3136').setDescription("<:failed:941027474106613791> ⠀|⠀ Enter amount to deposit! \`[amount/all]\`")
          if (amount.toLowerCase() !== 'all' && isNaN(Number(amount))) return interaction.reply({embeds : [invalid] , ephemeral : true})

          const data = await  db.getData(interaction.member.user.id)
          const bal =  data.bank

          const zero_balance = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Your bank balance is \`0\` <:kewl_coin:1013720156247183420>.')
          if ( bal === 0) return interaction.reply({embeds : [zero_balance] ,ephmeral : true});

          if(amount.toLowerCase() === 'all') {
            const withdrawn = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${bal}\` <:kewl_coin:1013720156247183420> withdrawn from bank :bank:`)
            await db.addCoins(interaction.member.user.id , bal)
            await db.removebank(interaction.member.user.id , bal)
            interaction.reply({embeds : [withdrawn]})
        } else {

            const to_with = Number(amount)   
            //argument is not a number
            const invalid_args = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Use the command in the format `.withdraw [amount]`')
            if (isNaN(to_with)) return interaction.reply ({embeds : [invalid_args] , ephmeral:true});

            //argument is more than cash in wallet
            const not_enough_cash = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Given amount is more than what you have!')
            if ( to_with > bal) return interaction.reply ({embeds : [not_enough_cash] , ephmeral:true});
            
            //deposited money embed
            const withdrawn = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${to_with}\` <:kewl_coin:1013720156247183420> withdrawn from bank :bank:`)
            await db.removeCoins(interaction.member.user.id , to_dep)
            await db.addbank(interaction.member.user.id , to_dep)
            interaction.reply({embeds : [withdrawn] });

            }

        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}