const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { colour } = require("../settings.json");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Warn = require('../models/WarnSchema');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Information')
		.addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Information about the current server'))
				.addSubcommand(subcommand =>
					subcommand
						.setName('user')
						.setDescription('Information about a user (including inviter)')
						.addUserOption(option =>
							option
								.setName('user')
								.setDescription('User to find.')
								.setRequired(true))),
	async execute(interaction) {
		//unix time, put into seconds to match discord timestamp
		if (interaction.options.getSubcommand() === "server") {
			try {
		const timestamp = Math.floor(Date.now() / 1000)
		const owner = await interaction.guild.fetchOwner()
		const pinged = new EmbedBuilder()
		.setColor(colour)
		.setTitle(`${interaction.guild.name}`)
		.addFields(
			{ name: 'Member count', value: `${interaction.guild.memberCount}` },
			{ name: 'Date', value: `<t:${timestamp}>` },
			{ name: 'Owner', value: `<@${owner.id}>` },
		)
		.setTimestamp()
		await interaction.reply({ embeds: [pinged] });
	} catch (error){
		interaction.reply(error.message)
}
		} else if (interaction.options.getSubcommand() === "user") {
			try {
			const user = await interaction.options.getUser('user')
			const member = await interaction.guild.members.cache.find(user => user.id === user.id)
			const timestamp = Math.floor(member.joinedTimestamp / 1000)
			const created = Math.floor(user.createdTimestamp / 1000)
			const warnsUser = await Warn.find({ guildId: interaction.guild.id, userId: user.id });
			let wLen = warnsUser.length;

			const pinged = new EmbedBuilder()
			.setColor(colour)
			.setTitle(`${user.tag}, ${user.id}`)
			.addFields(
				{ name: 'Created', value: `<t:${created}:R>` },
				{ name: 'Joined:', value: `<t:${timestamp}:R>` },
				{ name: 'Warns:', value: `${wLen}` },
			)
			.setTimestamp()
			await interaction.reply({ embeds: [pinged] });
			} catch (error){
				interaction.reply(error.message)
		}
			} 
		console.log('Info command - completed')
	},
};
