const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField} = require("discord.js");
const db = require('../../util/economy')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("View your or a users balance.")
    .addStringOption((option) =>
        option
        .setName('amount')
        .setDescription('Amount to deposir [amount/all]')
        .setRequired(true)
        ),

    async execute(client, interaction) {
        try {
            const amount = interaction.options.getString('amount')

            const invalid = new EmbedBuilder().setColor('#2f3136').setDescription("<:failed:941027474106613791> ⠀|⠀ Enter amount to deposit! \`[amount/all]\`")
            if (amount.toLowerCase() !== 'all' && isNaN(Number(amount))) return interaction.reply({embeds : [invalid] , ephemeral : true})

            const data = await  db.getData(interaction.member.user.id)
            const bal =  data.coins

            const zero_balance = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Your balance is \`0\` <:kewl_coin:1013720156247183420>. Use `daily` or `work` to earn.')
            if ( bal === 0) return interaction.reply({embeds : [zero_balance] ,ephmeral : true});
            
            if(amount.toLowerCase() === 'all') {
                const deposited = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${bal}\` <:kewl_coin:1013720156247183420> deposited to bank :bank:`)
                await db.removeCoins(interaction.member.user.id , bal)
                await db.addbank(interaction.member.user.id , bal)
                interaction.reply({embeds : [deposited]})
            } else {

                const to_dep = Number(amount)   
                //argument is not a number
                const invalid_args = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Use the command in the format `.deposit [amount]`')
                if (isNaN(to_dep)) return interaction.reply ({embeds : [invalid_args] , ephmeral:true});
    
                //argument is more than cash in wallet
                const not_enough_cash = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Given amount is more than what you have!')
                if ( to_dep > bal) return interaction.reply ({embeds : [not_enough_cash] , ephmeral:true});
                
                //deposited money embed
                const deposited = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${to_dep}\` <:kewl_coin:1013720156247183420> deposited to bank :bank:`)
                await db.removeCoins(interaction.member.user.id , to_dep)
                await db.addbank(interaction.member.user.id , to_dep)
                interaction.reply({embeds : [deposited] });

                }
        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}