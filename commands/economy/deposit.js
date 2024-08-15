const { EmbedBuilder } = require('discord.js');
const db = require("../../util/economy")

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    category : 'Economy',
    utilisation: "{prefix}deposit [amount]",
  
    async execute(client, message, args) {
      try {
            const arg = args[0]
            const data = await  db.getData(message.member.user.id)
            const bal =  data.coins

            const zero_balance = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Your balance is \`0\` <:kewl_coin:1013720156247183420>. Use `daily` or `work` to earn.')
            if ( bal === 0) return message.reply({embeds : [zero_balance] , allowedMentions: { repliedUser: false }});

            if (arg.toLowerCase() === 'all'){
                const deposited = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${bal}\` <:kewl_coin:1013720156247183420> deposited to bank :bank:`)
                await db.removeCoins(message.member.user.id , bal)
                await db.addbank(message.member.user.id , bal)
                message.reply({embeds : [deposited] , allowedMentions: { repliedUser: false }})
            } else {

            const to_dep = Number(arg)   
            //argument is not a number
            const invalid_args = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Use the command in the format `.deposit [amount]`')
            if (isNaN(to_dep)) return message.reply ({embeds : [invalid_args] , allowedMentions: { repliedUser: false }});

            //argument is more than cash in wallet
            const not_enough_cash = new EmbedBuilder().setColor('#2f3136').setDescription('<:failed:941027474106613791> ⠀|⠀ Invalid amount. Given amount is more than what you have!')
            if ( to_dep > bal) return message.reply ({embeds : [not_enough_cash] , allowedMentions: { repliedUser: false }});

            const deposited = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀ \`${to_dep}\` <:kewl_coin:1013720156247183420> deposited to bank :bank:`)
            await db.removeCoins(message.member.user.id , to_dep)
            await db.addbank(message.member.user.id , to_dep)
            message.reply({embeds : [deposited] , allowedMentions: { repliedUser: false }});
            }
          } catch(e) {
          console.log(e)
          message.channel.send(e.message)
      }
    }
  }
  