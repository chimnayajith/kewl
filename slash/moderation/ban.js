const { SlashCommandBuilder } = require("@discordjs/builders");
const {EmbedBuilder,ButtonBuilder,SelectMenuBuilder,ActionRowBuilder,PermissionsBitField} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a User")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to be banned")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason the user is banned.")
        .setRequired(false)
    )
    .setDefaultPermission(true),

  async execute(client, interaction) {
    try {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      //   const command = await client.guilds.cache.get('899195708626849802')?.commands.fetch('929781699842310154');
      //   const permissions = [
      //     {
      //         id: '891581154765979668',
      //         type: 'USER',
      //         permission: true,
      //     }
      // ];
      // await command.permissions.add({ permissions });
      const banMember =
        interaction.guild.members.cache.get(user.id) ||
        (await interaction.guild.members.fetch(user.id).catch((err) => {}));

      const no_perm = new EmbedBuilder()
        .setColor(`#2f3136`)
        .setDescription(
          "<:failed:941027474106613791> ⠀|⠀ You do not have the `Ban Members` permission!"
        );
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.BanMembers
        )
      )
        return interaction.reply({ embeds: [no_perm], ephemeral: true });

      const not_in_guild = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "** <:failed:941027474106613791> ⠀|⠀User not in this Server! **"
        );
      if (!banMember)
        return interaction.reply({ embeds: [not_in_guild], ephemeral: true });

      const banyourself = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "**<:failed:941027474106613791> ⠀|⠀You cannot ban yourself!**"
        );
      if (banMember === interaction.member)
        return interaction.reply({ embeds: [banyourself], ephemeral: true });

      const cantkick = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "**<:failed:941027474106613791> ⠀|⠀Can't ban that user!**"
        );
      if (!banMember.bannable)
        return interaction.reply({ embeds: [cantkick], ephemeral: true });

      const cannot_ban = new EmbedBuilder()
        .setColor("#2f3136")
        .setDescription(
          "**<:failed:941027474106613791>  ⠀|⠀Cannot Ban this User!**"
        );
      if (
        banMember.roles.highest.comparePositionTo(
          interaction.guild.members.me.roles.highest
        ) >= 0
      )
        return interaction.reply({ embeds: [cannot_ban], ephemeral: true });

      const confirmation = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Ban Confirmation")
        .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
            name: "<:user:940844698166263828> Target User :",
            value: `<@${banMember.user.id}> [${banMember.user.tag}]`,
          },
          {
            name: "<:rightSort:941015879129387018> Reason :",
            value: `\`${reason || "No Reason Provided"}\``,
          }
        );

      const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("ban")
          .setPlaceholder("Do you want to proceed?")
          .addOptions([
            {
              label: "Ban User",
              description: "Ban Users without deleting messages.",
              value: "simpleban",
              emoji: "<:ban:929185718461419540>",
            },
            {
              label: "Ban User & Purge 24 Hours",
              description:
                "Ban User & Delete user's messages in the last 24 hour.",
              value: "ban24",
              emoji: "<:ban:929185718461419540>",
            },
            {
              label: "Ban User & Ourge 7 days",
              description:
                "Ban User & Delete user's messages in the last 7 days.",
              value: "ban7",
              emoji: "<:ban:929185718461419540>",
            },
            {
              label: "Cancel ",
              description: "Cancel the ban.",
              value: "cancel",
              emoji: "<:cancel:941537137621368902>",
            },
          ])
      );
      const disabledrow = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("sed")
          .setPlaceholder("Do you want to proceed?")
          .setDisabled(true)
          .addOptions([
            {
              label: "Utility",
              description: "Utility commands",
              value: "Utility",
              emoji: "<a:utility:889018312514752532>",
            },
          ])
      );
      const msg = await interaction.reply({
        embeds: [confirmation],
        components: [row],
        fetchReply: true,
      });

      const collector = msg.createMessageComponentCollector({
        time: 30000,
        ComponentType: 3,
      });

      const banned = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({
          name: `You have been banned in ${interaction.guild.name}`,
          iconURL: interaction.guild.iconURL(),
        })
        .setDescription(
          `<:user:940844698166263828> **Member: ** ${
            banMember.user.tag
          } \n<:rightSort:941015879129387018> **Reason: ** ${
            reason || "No Reason Provided"
          }`
        );
      const simpleban = new EmbedBuilder()
        .setColor("#00FF00")
        .setDescription(
          `<:ticck:929033546377609216>⠀|⠀**${
            banMember.user.tag
          }** has been banned for **\`${reason || "No Reason Provided"}\`**`
        );
      const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle(`${interaction.guild.name}⠀|⠀Mod Logs`)
        .setURL("https://beatsmusic.ga")
        .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "Action", value: `**Ban**`, inline: true },
          {
            name: "Banned User",
            value: `\`${banMember.user.tag}\``,
            inline: true,
          },
          { name: "User ID", value: `\`${banMember.user.id}\``, inline: true },
          {
            name: "Reason",
            value: `\`${reason || "No Reason Provided"}\``,
            inline: true,
          },
          {
            name: "Banned By",
            value: `\`${interaction.user.username}\``,
            inline: true,
          },
          {
            name: "Date",
            value: `\`${interaction.createdAt.toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({
          text: `${interaction.guild.name}`,
          iconURL: interaction.guild.iconURL(),
        })
        .setTimestamp();
      const sChannel = interaction.guild.channels.cache.get(
        client.config.bot.modlogid
      );
      if (!sChannel) return;

      collector.on("collect", async (collected) => {
        const value = collected.values[0];
        if (collected.user.id !== interaction.user.id)
          return collected.followUp({
            content: `:x:  |  That command wasnt for you `,
            ephemeral: true,
          });
        if (value === "simpleban") {
          banMember.send({ embeds: [banned] }).catch(() => null);
          banMember.ban({ reason: reason });
          await collected.deferUpdate();
          sChannel.send({ embeds: [embed] });
          await collected
            .editReply({
              embeds: [simpleban],
              components: [],
              ephemeral: false,
            })
            .then((message) => setTimeout(() => message.delete(), 15000));
          collector.stop();
        } else if (value === "ban24") {
          banMember.send({ embeds: [banned] }).catch(() => null);
          banMember.ban({ deleteMessageDays: 1, reason: reason });
          await collected.deferUpdate();
          sChannel.send({ embeds: [embed] });
          await collected
            .editReply({
              embeds: [simpleban],
              components: [],
              ephemeral: false,
            })
            .then((message) => setTimeout(() => message.delete(), 15000));
          collector.stop();
        } else if (value === "ban7") {
          banMember.send({ embeds: [banned] }).catch(() => null);
          banMember.ban({ deleteMessageDays: 7, reason: reason });
          interaction.guild.members.ban(`${user.id} `);
          await collected.deferUpdate();
          sChannel.send({ embeds: [embed] });
          await collected
            .editReply({
              embeds: [simpleban],
              components: [],
              ephemeral: false,
            })
            .then((message) => setTimeout(() => message.delete(), 15000));
          collector.stop();
        } else if (value === "cancel") {
          await collected.deferUpdate();
          confirmation.setTitle("Ban Cancelled");
          await collected
            .editReply({
              embeds: [confirmation],
              components: [disabledrow],
              ephemeral: false,
            })
            .then((message) => setTimeout(() => message.delete(), 15000));
          collector.stop();
        }
      });
      collector.on("end", async (c, reason) => {
        if (reason === "time") {
          confirmation.setTitle("Ban Cancelled");
          msg
            .edit({ embeds: [confirmation], components: [disabledrow] })
            .then((message) => setTimeout(() => message.delete(), 15000));
        }
      });
    } catch (e) {
      console.log(e);
      return interaction.channel.send(`${e.message}`);
    }
  },
};
