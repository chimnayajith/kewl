require("../util/guild_data.js");
const { EmbedBuilder } = require("discord.js");
const db = require("../util/afk_data")
module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  if(await db.hasAfk( message.author.id)){
    await db.removeAfk( message.author.id)
    const afk_remove = new EmbedBuilder().setColor("#2f3136").setDescription('<a:afk:1026022420718563329>⠀|⠀Your AFK has been removed!')
    message.reply({embeds : [afk_remove] , allowedMentions : { repliedUser: false }}).then((message) => setTimeout(() => message.delete(), 15000));
  }

  if(message.mentions.members.size !== 0){
    message.mentions.members.forEach(async member => {
      if(await db.hasAfk( member.user.id)){
        const data = await db.getAfk( member.user.id)
        const has_afk = new EmbedBuilder().setColor("#2f3136").setDescription(`<a:afk:1026022420718563329>⠀|⠀${member.user.username} is AFK : \`${data.message}\` : <t:${Math.round(data.timestamp / 1000)}:R>`)
        message.reply({embeds : [has_afk] ,allowedMentions : { repliedUser: false }})
      }
    })
  }

  let guildDB = await message.guild.fetchDB();
  const prefix = guildDB.prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd =
    client.commands.get(command) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));
  if (cmd) cmd.execute(client, message, args);
};
