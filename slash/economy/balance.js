const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField} = require("discord.js");
const db = require('../../util/economy')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("View your or a users balance.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User")
        .setRequired(false)
    ),

    async execute(client, interaction) {
        try {
            const user = interaction.options.getUser("user") || interaction.member.user;

            const transfer_to_bot = new EmbedBuilder().setColor('#2f3136').setDescription(`<:failed:941027474106613791> ⠀|⠀A bot doesn't have any money!`)
            if (user.bot) return interaction.reply({embeds : [transfer_to_bot] , ephemeral : true})

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
        interaction.reply({embeds : [balance_embed]})
        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}