const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField , AttachmentBuilder} = require("discord.js");
const db = require('../../util/levelling')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("levels")
    .setDescription("Get the leaderboard of the server"),


    async execute(client, interaction) {
        try {
            const rank_list = await db.ranklist(interaction.guild.id)

            const no_ranks = new EmbedBuilder().setColor("#2f3136").setDescription("<:failed:941027474106613791> ⠀|⠀ No one in this server has any XP!")
            if(rank_list.length === 0 ) return interaction.reply({embeds : [ no_ranks] , ephemeral : true})
            console.log(rank_list)
            const desc = rank_list.map( (each , num) => {
                return `- ${num + 1} \t ${client.users.cache.get(each.userId).tag.padEnd(20)} ${each.level.toString().padEnd(0)}`
            }).join('\n')

            const leaderboard = new EmbedBuilder().setColor('#2f3136').setTitle(`${interaction.guild.name}'s Leaderboard`)
          .setFooter({text : interaction.guild.name , iconURL:interaction.guild.iconURL()}).setTimestamp()
          .setDescription(`\`\`\`diff\n! No\tUsername\t\t\tLevel\n──────────────────────────────────────\n${desc}\`\`\`\nClick [Here](https://beatsbot.in) to view the entire leaderboard.`)

          interaction.reply({embeds : [leaderboard]})
        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}