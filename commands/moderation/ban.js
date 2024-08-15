const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: [],
  utilisation: "{prefix}ban",

  async execute(client, message, args) {
    try {
      const noperm = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("You don't have permission to ban users!");
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
        return message.channel.send({ embeds: [noperm] });
      const nouser = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("Provide a user to Ban!");
      if (!args[0]) return message.channel.send({ embeds: [nouser] });

      let banMember =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          (r) => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()
        ) ||
        message.guild.members.cache.find(
          (ro) => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()
        );
      const notinguild = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("User not in guild!");
      if (!banMember) return message.channel.send({ embeds: [notinguild] });
      const banyourself = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("You cannot ban yourself!");
      if (banMember === message.member)
        return message.channel.send({ embeds: [banyourself] });

      var reason = args.slice(1).join(" ");
      const cantban = new EmbedBuilder()
        .setColor("#ff1900")
        .setDescription("Can't ban that user! ");
      if (!banMember.bannable)
        return message.channel.send({ embeds: [cantban] });
      try {
        const banned = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle(`<:ban:929185718461419540> Banned`)
          .setDescription(
            `You were banned from **${message.guild.name}** for  **${
              reason || "`reason not provided`"
            }**`
          );
        banMember.send({ embeds: [banned] }).catch(() => null);
        message.guild.members.ban(banMember);
      } catch {
        message.guild.members.ban(banMember);
      }
      if (reason) {
        const sembed = new EmbedBuilder()
          .setColor("#00FF00")
          .setDescription(
            `<:ticck:929033546377609216> ⠀|⠀**${banMember.user.tag}** has been banned for **${reason}**`
          );
        message.channel.send({ embeds: [sembed] });
      } else {
        const sembed2 = new EmbedBuilder()
          .setColor("#00FF00")
          .setDescription(
            `<:ticck:929033546377609216>  **${banMember.user.tag}** has been banned`
          );
        message.channel.send({ embeds: [sembed2] });
      }

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Beats Support⠀|⠀Mod Logs")
        .setURL("https://beatsmusic.ga")
        .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "Action", value: `**Ban**`, inline: true },
          {
            name: "Banned User",
            value: `\`${banMember.user.tag}\``,
            inline: true,
          },
          { name: "USER ID", value: `\`${banMember.id}\``, inline: true },
          { name: "Reason", value: `\`${reason || "-"}\``, inline: true },
          {
            name: "Banned By",
            value: `\`${message.author.username}\``,
            inline: true,
          },
          {
            name: "Date",
            value: `\`${message.createdAt.toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({ text: "Beats Support", iconURL: message.guild.iconURL() })
        .setTimestamp();

      var sChannel = message.guild.channels.cache.get(
        client.config.bot.modlogid
      );

      if (!sChannel) return;
      sChannel.send({ embeds: [embed] });
    } catch (e) {
      return message.channel.send(`${e.message}`);
    }
  },
};
