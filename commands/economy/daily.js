const { EmbedBuilder } = require('discord.js');
const db = require("../../util/economy")

module.exports = {
  name: 'daily',
  aliases: [],
  category : 'Economy',
  utilisation: "{prefix}daily",

  async execute(client, message, args) {
    try {

        const data = await db.getData(message.member.user.id)
        const lastDaily = data.lastDaily

        if (lastDaily !== null && 4.32e+7 - (Date.now() - lastDaily) > 0){
          const nextDaily = lastDaily + 4.32e+7
          const already_got = new EmbedBuilder().setColor("#2f3136").setDescription(`You already collected you daily today. Next daily in <t:${Math.round(nextDaily / 1000)}:R>`)
          message.reply({embeds : [already_got] , allowedMentions: { repliedUser: false }})
        } else {
            db.addCoins(message.member.user.id , 2500)
            db.newDaily(message.member.user.id)
            const daily_rewarded = new EmbedBuilder().setColor("#2f3136").setTitle("Daily Bonus").setDescription('You received \`2500\` <:kewl_coin:1013720156247183420>')
            .setTimestamp().setFooter({text :' ' , iconURL : message.member.displayAvatarURL()})
            message.reply({embeds : [daily_rewarded] , allowedMentions: { repliedUser: false }})
        }
        } catch(e) {
        console.log(e)
        message.channel.send(e.message)
    }
  }
}
