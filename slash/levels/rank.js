const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField , AttachmentBuilder} = require("discord.js");
const db = require('../../util/levelling')
const canvacord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your Rank Card.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User")
        .setRequired(false)
    ),

    async execute(client, interaction) {
        try {
            const user = interaction.options.getUser("user") || interaction.member.user;

            const bot_no_rank = new EmbedBuilder().setColor("#2f3136").setDescription("<:failed:941027474106613791> ⠀|⠀Bots do not have rank!!")
            if (user.bot) return interaction.reply({embeds : [bot_no_rank] , ephemeral : true});
            
            const member = await interaction.guild.members.fetch(user.id)
            interaction.deferReply()
            const data = await db.getRank(interaction.guild.id , user.id)
            const rank = new canvacord.Rank()
                .setAvatar(user.displayAvatarURL())
                .setCurrentXP(data[1].xp , '#FFCC00')
                .setRequiredXP(await db.neededXP(data[1].level) , '#FFCC00')
                .setRank(data[1].level , "LEVEL" )
                .setLevel(data[0], 'RANK')
                .setLevelColor("#FFCC00")
                .setRankColor("#FFCC00")
                .setProgressBar("#FFCC00", "COLOR")
                .setOverlay("#3a3b3c", 0.7)
                .setStatus(member.presence.status , true , 0.5)
                .setUsername(user.username)
                // .setBackground("IMAGE" , "https://img.wallpapersafari.com/desktop/1920/1080/80/75/v7ryDG.jpg")
                .setBackground("IMAGE" , "https://imageio.forbes.com/specials-images/imageserve/5ed68e8310716f0007411996/0x0.jpg")
                // .setBackground("IMAGE" , "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo2dFDiYIZ1Ec759qJrhNm4_2hneoK0hPW_-WJIv1tL9CiOav_CuYilwuB3xt5H1sgJRo&usqp=CAU")
                .setDiscriminator(user.discriminator);

                rank.build()
                .then(buffer => {
                    const file = new AttachmentBuilder(buffer)
                    interaction.editReply({files : [file]})
                });

        } catch (e) {
          console.log(e);
          return interaction.channel.send(`${e.message}`);
        }
      },
}