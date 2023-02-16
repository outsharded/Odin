const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, GatewayIntentBits, Client, Partials, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.GuildMember, Partials.User] });
//, GatewayIntentBits.GuildMembers
const { colour } = require("../settings.json");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Times a user out.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to timeout.')
                .setRequired(true))
        .addNumberOption(option =>
            option
                .setName('days')
                .setDescription('How long to timeout the user (max 28 days)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(28))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for timeout.')
                .setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
			const user = interaction.options.getUser("user")
            const days = interaction.options.getNumber("days")
            const reason = interaction.options.getString("reason")
            const guildUser = interaction.guild.members.cache.get(user.id);
        try {
            await guildUser.timeout( days * 1440 * 60 * 1000, reason)
            const toEmb = new EmbedBuilder()
                .setColor(colour)
                .setTitle('Sucessful timeout')
                .setDescription(`Timed out <@${user.id}> for **${reason}** for **${days} days.**`)
                .setTimestamp()  
            await interaction.reply({ embeds: [toEmb] })
            console.log('timeout command sucessful')
		} catch (error) {
			await interaction.reply(error.message);
			console.warn(`Timeout command failed. Code: err-api-err`)
		}
		} else {
			interaction.reply(`You don't have permission to run this!`);
            console.log('Timeout command - completed Code: - err-no-per')
		}
	},
}