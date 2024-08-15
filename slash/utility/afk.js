const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField , Collection} = require("discord.js");
const db = require('../../util/afk_data')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set an AFK status shown when you are mentioned")
    .addStringOption( (option) => option.setName('message').setDescription('Message to set').setRequired(false)),

    async execute(client, interaction) {
        try {
            const message = interaction.options.getString('message')

            const data = await db.setAfk( interaction.member.user.id , message )

            const setAfk = new EmbedBuilder().setColor("#2f3136").setDescription(`<:ticck:929033546377609216>⠀|⠀Set your AFK : \`${data.message}\``)
            interaction.reply({ embeds : [setAfk] , ephemeral : true})
            
        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}