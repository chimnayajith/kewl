const { EmbedBuilder, InteractionCollector } = require('discord.js');
const db = require("../../util/economy")

module.exports = {
    name: 'give',
    aliases: ['share'],
    category : 'Economy',
    utilisation: "{prefix}give [user] [amount]",
  
    async execute(client, message, args) {
      try {

            //taking in arguments
            const arg = args[0]
            const amount = Number(args[1])
            const user = message.mentions.users.first()

            //fetching data from db
            const data = await  db.getData(message.member.user.id)
            const cur_bal =  data.coins

            //mention not in right order
            const wrong_format = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ Wrong format. Use : \`.give [mention user] [amount]\``)
            if (!arg.includes(user.id)) return message.reply({embeds : [wrong_format] , allowedMentions: { repliedUser: false }});

            //amount given is not valid
            const invalid_amt = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ Invalid amount. Use : \`.give [mention user] [amount]\``)
            if (isNaN(amount)) return message.reply({embeds : [invalid_amt] , allowedMentions: { repliedUser: false }});

            //transferring to yourself
            const transfer_to_self = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀You can't transfer amount to yourself!`)
            if ( message.member.user.id === user.id) return interaction.reply({embeds : [transfer_to_self] , allowedMentions:{repliedUser:false}});

            //zero cash in hand
            const zero_bal = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ You have \`0\` <:kewl_coin:1013720156247183420>. Use \`daily\` or \`work\` to earn.`)
            if(amount=== 0) return message.reply({embeds : [zero_bal] , allowedMentions: { repliedUser: false }});

            //insufficient funds
            const insufficient = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ You have less than the given amount. You are ${amount - cur_bal} <:kewl_coin:1013720156247183420> short!`)
            if ( amount > cur_bal) return message.reply({embeds : [insufficient] , allowedMentions: { repliedUser: false }});

            //transferring funds
            await db.removeCoins(message.member.user.id , amount )
            await db.addCoins(user.id , amount)

            const trasferred = new EmbedBuilder().setColor('#2f3136').setDescription(`<:ticck:929033546377609216>⠀|⠀You gave **${amount}** <:kewl_coin:1013720156247183420>'s to <@${user.id}>. You now have : \`${cur_bal - amount}\` <:kewl_coin:1013720156247183420>`)
            message.reply({embeds : [trasferred] , allowedMentions: { repliedUser: false }})
          } catch(e) {
          console.log(e)
          message.channel.send(e.message)
      }
    }
  }
  