require("../util/guild_data.js");
const { InteractionType } = require("discord.js");

module.exports = async (client, interaction) => {
  let guildDB = await interaction.guild.fetchDB();
  if (interaction.type === InteractionType.ApplicationCommand) {
    const cmd = await client.slashCommands.get(interaction.commandName);

    if (cmd) {
      if (interaction.commandName == cmd.data.name) {
        cmd.execute(client, interaction, guildDB);
      }
    }
  }
};
