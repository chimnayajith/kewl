const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField , Collection} = require("discord.js");
const db = require('../../util/economy')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Get the economy leaderboard of your server!"),

    async execute(client, interaction) {
        try {
          const collection = new Collection();

          const data = await db.getLeaderboard()
          data.forEach(each => {
            if (interaction.guild.members.fetch(each.userId)){
              const id = each.userId;
              const net = each.coins + each.bank
              collection.set(id , {id , net})
            }
          })
    
          const no_users = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀ No users in this server have used the economy system.`)
          if(collection.size === 0) return interaction.reply({embeds : [no_users] , ephemeral : true})
    
          const sorted = collection.sort((a , b) => b.net - a.net).first(10);
    
          const desc = sorted.map( (each , number) => {
            return `- ${number + 1} \t${client.users.cache.get(each.id).tag.padEnd(20)}  ${each.net.toString().padStart(5).padEnd(0)}`
          }).join('\n')
          const leaderboard = new EmbedBuilder().setColor('#2f3136').setTitle(`${interaction.guild.name}'s Leaderboard`)
          .setFooter({text : interaction.guild.name , iconURL:interaction.guild.iconURL()}).setTimestamp()
          .setDescription(`\`\`\`diff\n! No\tUsername\t\t\tNet worth\n──────────────────────────────────────\n${desc}\`\`\`\nClick [Here](https://beatsbot.in) to view the entire leaderboard.`)
    
          interaction.reply({embeds : [leaderboard] })
        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}