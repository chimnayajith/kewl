const { EmbedBuilder } = require('discord.js');
const db = require("../../util/economy")

module.exports = {
  name: 'balance',
  aliases: ['bal'],
  category : 'Economy',
  utilisation: "{prefix}balance [member]",

  async execute(client, message, args) {
    try {
        let user = message.mentions.users.first() || message.author
        
        const data = await db.getData(user.id)

        const balance_embed = new EmbedBuilder().setColor('#2f3136').setThumbnail(user.avatarURL()).setTitle(`${user.tag}'s balance`)
            .addFields(
                {
                    name : "Cash",
                    value : `\`${data.coins}\` <:kewl_coin:1013720156247183420>`,
                    inline : true 
                },
                {
                    name : "Bank",
                    value : `\`${data.bank}\` <:kewl_coin:1013720156247183420>`,
                    inline : true 
                },
                {
                    name : "Net",
                    value : `\`${data.coins + data.bank}\` <:kewl_coin:1013720156247183420>`,
                    inline : true 
                }
            )
        message.reply({embeds : [balance_embed] , allowedMentions: { repliedUser: false }})
    } catch(e) {
        console.log(e)
        message.channel.send(e.message)
    }
  }
}
