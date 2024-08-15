const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const discord = require('discord.js')
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const commands = [];
let rest;


client.slashCommands = new discord.Collection();

const clientId = '889822092579725312';
const guildId = '899195708626849802';

	

fs.readdirSync('./slash').forEach(dirs => {
console.log(`Loading ${dirs} commands..`)
const commandFiles = fs.readdirSync(`./slash/${dirs}/`).filter(file => file.endsWith('.js'));
rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

for (const file of commandFiles) {
	const command = require(`../slash/${dirs}/${file}`);
	console.log(`=> Loaded ${command.data.name} command ✅`);
    client.slashCommands.set(command.data.name.toLowerCase(), command);
	commands.push(command.data.toJSON());
}
console.log('')
});
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId,guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();