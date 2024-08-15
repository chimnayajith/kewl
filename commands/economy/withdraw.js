const { EmbedBuilder } = require('discord.js');
const db = require("../../util/economy")

module.exports = {
    name: 'withdraw',
    aliases: ['with'],
    category : 'Economy',
    utilisation: "{prefix}withdraw [amount]",
  
    async execute(client, message, args) {
      try {
            const arg = args[0]
            const data = await  db.getData(message.member.user.id)
            const bal =  data.bank

            const zero_balance = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Your bank balance is \`0\` <:kewl_coin:1013720156247183420>.')
            if ( bal === 0) return message.reply({embeds : [zero_balance] , allowedMentions: { repliedUser: false }});

            if (arg.toLowerCase() === 'all'){
                const withdrawn = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${bal}\` <:kewl_coin:1013720156247183420> withdrawn from bank :bank:`)
                await db.removebank(message.member.user.id , bal)
                await db.addCoins(message.member.user.id , bal)
                message.reply({embeds : [withdrawn] , allowedMentions: { repliedUser: false }})
            } else {

            const to_with = Number(arg)   
            //argument is not a number
            const invalid_args = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Use the command in the format `.withdraw [amount]`')
            if (isNaN(to_with)) return message.reply ({embeds : [invalid_args] , allowedMentions: { repliedUser: false }});

            //argument is more than cash in wallet
            const not_enough_cash = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Given amount is more than what you have!')
            if ( to_with > bal) return message.reply ({embeds : [not_enough_cash] , allowedMentions: { repliedUser: false }});

            const withdrawn = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${to_with}\` <:kewl_coin:1013720156247183420> withdrawn from bank :bank:`)
            await db.removebank(message.member.user.id , to_with)
            await db.addCoins(message.member.user.id , to_with)
            message.reply({embeds : [withdrawn] , allowedMentions: { repliedUser: false }});
            }
          } catch(e) {
          console.log(e)
          message.channel.send(e.message)
      }
    }
  }
  