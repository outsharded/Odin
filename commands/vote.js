const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { colour } = require("../settings.json");
//define embed
const voteEmbed = new EmbedBuilder()
	.setColor(colour)
	.setTitle('Vote')
	.setDescription('Thanks for supporting the bot!')
	.setTimestamp()

// define links in embed
const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('Discord Bot List')
            .setURL('https://discordbotlist.com/bots/the-swift/upvote')
            .setStyle(ButtonStyle.Link),
		new ButtonBuilder()
            .setLabel('discords.com')
            .setURL('https://discords.com/bots/bot/1045760873316229193/vote')
            .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
            .setLabel('top.gg')
            .setURL('https://top.gg/bot/1045760873316229193/vote')
            .setStyle(ButtonStyle.Link),
    );

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote for the bot!'),
	async execute(interaction) {
        //send embed and buttons for links
		await interaction.reply({ embeds: [voteEmbed], components: [row] });
        console.log('Vote command - completed')
	},
};