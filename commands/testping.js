const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { colour } = require("../settings.json");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check if the bot is online'),
	async execute(interaction) {
		//define first response
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		//send response
		sent
		//then update message with ping
		const pinged = new EmbedBuilder()
			.setColor(colour)
			.setTitle(`Pong! :ping_pong:`)
			.addFields(
				{ name: 'Roundtrip latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}` + ' ms' },
				{ name: 'Shard', value: `${interaction.guild.shardId}` },
			)
			.setTimestamp()
		interaction.editReply({ content: '', embeds: [pinged] });
		console.log('Ping command - completed')
	},
};
