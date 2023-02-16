const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { colour } = require("../settings.json");




//embeds with ccommands
const helpEmbed1 = new EmbedBuilder()
	.setColor(colour)
	.setTitle('Page 1')
	//.setDescription('For full commands list, go on the website.')
	.addFields(
		{ name: '/help', value: 'Get a command list' },
		{ name: '/check', value: 'Use AI to check whether a message is offensive.' },
		{ name: '/info', value: 'Server info' },
		{ name: '/ping', value: 'Check if the bot is online' },
		{ name: '/vote', value: 'Vote for the bot' },
		{ name: '/report', value: 'Report an issue to the staff team.' },
	)
	.setFooter({ text: 'Page 1/2' })
	.setTimestamp()

	const helpEmbed2 = new EmbedBuilder()
	.setColor(colour)
		.setTitle('Page 2')
		//.setDescription('For full commands list, go on the website.')
		.addFields(
			{ name: '/warn', value: 'Warns a user.' },
			{ name: '/warns', value: 'Gets all warns in the server of for a user.' },
			{ name: '/removewarns', value: 'Remove a warn.' },
			{ name: '/timeout', value: `Timeouts a user (up to 28 days)` },
			{ name: '/purge', value: `Removes the specified number of messages from a channel` },
			{ name: '/settings', value: `Modify settings for the bot` },
		)
		.setFooter({ text: 'Page 2/2' })
		.setTimestamp()


//buttons
const row = new ActionRowBuilder()
.addComponents(
	new ButtonBuilder()
		.setCustomId('1')
		.setLabel('<<')
		.setStyle(ButtonStyle.Primary))
.addComponents(
	new ButtonBuilder()
		.setCustomId('2')
		.setLabel('>>')
		.setStyle(ButtonStyle.Primary),
)
//.addComponents(
//	new ButtonBuilder()
//		.setURL('https://tec-kids.co.uk/pages/commands.html')
//		.setLabel('Full command list')
//		.setStyle(ButtonStyle.Link));

const inactiverow = new ActionRowBuilder()
.addComponents(
	new ButtonBuilder()
		.setCustomId('page1')
		.setLabel('<<')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true))
.addComponents(
	new ButtonBuilder()
		.setCustomId('page2')
		.setLabel('>>')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true)
);



module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get a command list.')
		.addIntegerOption(option =>
            option
                .setName('page')
                .setDescription('Page of the command list.')
                .setRequired(true)
				.addChoices(
					{ name: 'User', value: 1 },
					{ name: 'Admin/Moderator', value: 2 },
				)),
	async execute(interaction) {
		const page = await interaction.options.getInteger('page')
		if (page == 1) {
		await interaction.reply({ embeds: [helpEmbed1], components: [row] })
		} else if (page == 2) {
		await interaction.reply({ embeds: [helpEmbed2], components: [row] })
		}
		const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
		
		collector.on('collect', async i => {
			if (i.customId === '1') {
				await i.update({ embeds: [helpEmbed1], components: [row] });
			} else if (i.customId === '2') {

				await i.update({ embeds: [helpEmbed2], components: [row] });
			}
		});

		await collector.on('end', collected => console.log(`Collected ${collected.size} items`, interaction.editReply({components: [inactiverow] }))),
		console.log('Help command - completed')
	},
};
			
