const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField} = require("discord.js");
const db = require('../../util/economy')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Collect daily reward!"),

    async execute(client, interaction) {
        try {
            const data = await db.getData(interaction.member.id)
            const lastDaily = data.lastDaily

            if (lastDaily !== null && 4.32e+7 - (Date.now() - lastDaily) > 0){
                const nextDaily = lastDaily + 4.32e+7
                const already_got = new EmbedBuilder().setColor("#2f3136").setDescription(`You already collected you daily today. Next daily in <t:${Math.round(nextDaily / 1000)}:R>`)
                interaction.reply({embeds : [already_got]})
              } else {
                  db.addCoins(interaction.member.id , 2500)
                  db.newDaily(interaction.member.id)
                  const daily_rewarded = new EmbedBuilder().setColor("#2f3136").setTitle("Daily Bonus").setDescription('You received \`2500\` <:kewl_coin:1013720156247183420>')
                  .setTimestamp().setFooter({text :' ' , iconURL : interaction.member.displayAvatarURL()})
                  interaction.reply({embeds : [daily_rewarded]})
              }
        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}