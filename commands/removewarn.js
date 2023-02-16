const { SlashCommandBuilder, EmbedBuilder, IntegrationExpireBehavior, PermissionsBitField, PermissionFlagsBits  } = require('discord.js');
const mongoose = require('mongoose');
const Warn = require('../models/WarnSchema');
const { colour } = require("../settings.json");
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removewarn')
		.setDescription('Remove a warning.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('single')
                .setDescription('Remove a warning buy ID (use /warns user to get id)')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('ID of warning: get it from /warns user.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Clear every warning in this guild.')
                .addStringOption(option =>
                    option
                        .setName('confirmation')
                        .setDescription('Type in CONFIRM to confirm you want to remove EVERY WARNING ON THIS SERVER!')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await interaction.reply({ content: "You are not allowed to remove warns!", ephemeral: true })
        } else {
            
            if (interaction.options.getSubcommand() === "clear") {
            if (interaction.options.getString('confirmation') === "CONFIRM" ) {
                try {
                    await Warn.deleteMany({ guidldId: interaction.guild.id });
                    await interaction.reply('All warns in this guild have been removed');
                } catch (error) {
                    await interaction.reply(error.message);
                    console.warn(error)
                    console.warn(`Text command failed.`)
                }  
            } else {
                await interaction.reply({ content : 'Please confirm you want to remove every message', ephemeral: true });
            }
            } else {
                const id = interaction.options.getString("id")
                try {
                await Warn.deleteOne({ _id: id });
                const remwarnsEmbed = new EmbedBuilder()
                    .setColor(colour)
                    .setTitle('Sucessfully removed warning.')
                    .setDescription(`Removed warn ${id}.`)
                    .setTimestamp()    
                await interaction.reply({ embeds: [remwarnsEmbed]});
                    } catch (error) {
                        await interaction.reply(error.message);
                        console.warn(error)
                        console.warn(`Text command failed.`)
                    }
}
    }
		console.log('removewarn command - completed')
	},
};