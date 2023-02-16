const { Client, GatewayIntentBits, Events, REST, Collection, Routes } = require("discord.js");
const fs = require('node:fs');
const path = require("path");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });
const { clientId, token } = require('./config.json');


client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath)
//.filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}


client.login(token);

client.on(Events.ClientReady, () => {
//start deploying commands	
const commands = [];
const commandFiles = fs.readdirSync('./commands')
//.filter(file => file.endsWith('.js', or, '.ts'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

    console.warn("Bot is online");
    client.user.setActivity('with the wires.')
	return client.shard.fetchClientValues('guilds.cache.size')
			.then(results => {
				return console.log(`Server count: ${results.reduce((acc, guildCount) => acc + guildCount, 0)}`);
			})
			.catch(console.error);
});


client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand(), !interaction.isButton()){

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}} else if (!interaction.isChatInputCommand(), interaction.isButton()) {

	} else {
		return;
	}
});


