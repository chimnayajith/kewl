const { EmbedBuilder } = require("discord.js");
const discord = require("discord.js");
const db = require("../../util/economy");

module.exports = {
  name: "leaderboard",
  aliases: ["lb"],
  category: "Economy",
  utilisation: "{prefix}leaderboard",

  async execute(client, message, args) {
    try {
      const collection = new discord.Collection();

      const data = await db.getLeaderboard()
      data.forEach(each => {
        if (message.guild.members.fetch(each.userId)){
          const id = each.userId;
          const net = each.coins + each.bank
          collection.set(id , {id , net})
        }
      })

      const no_users = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ No users in this server have used the economy system.`)
      if(collection.size === 0) return message.reply({embeds : [no_users] , allowedMentions: { repliedUser: false }})

      const sorted = collection.sort((a , b) => b.net - a.net).first(10);

      const desc = sorted.map( (each , number) => {
        return `- ${number + 1} \t${client.users.cache.get(each.id).tag.padEnd(20)}  ${each.net.toString().padStart(5).padEnd(0)}`
      }).join('\n')
      const leaderboard = new EmbedBuilder().setColor('#2f3136').setTitle(`${message.guild.name}'s Leaderboard`)
      .setFooter({text : message.guild.name , iconURL:message.guild.iconURL()}).setTimestamp()
      .setDescription(`\`\`\`diff\n! No\tUsername\t\t\tNet worth\n──────────────────────────────────────\n${desc}\`\`\`\nClick [Here](https://beatsbot.in) to view the entire leaderboard.`)

      message.reply({embeds : [leaderboard] , allowedMentions: { repliedUser: false }})
    } catch (e) {
      console.log(e);
      message.channel.send(e.message);
    }
  },
};
