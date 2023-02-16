const { SlashCommandBuilder, EmbedBuilder, GatewayIntentBits, PermissionsBitField, PermissionFlagsBits, Client  } = require('discord.js');
const fs = require("fs");
const mongoose = require('mongoose');
const Warn = require('../models/WarnSchema');
const Setting = require('../models/SettingsSchema');
const { colour } = require("../settings.json");
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a user.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to warn.')
                .setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('Reason for warn.')
				.setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        const dm = await Setting.find({ type: 1, guildId: interaction.guild.id });
        const dm_val = await Setting.find({ type: 2, guildId: interaction.guild.id });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await interaction.reply({ content: "You are not allowed to warn members!", ephemeral: true })
        } else {
            
        const user = interaction.options.getUser("user")
        const reason = interaction.options.getString("reason") ?? 'No reason provided';
        const newWarn = new Warn({ 
            guildId: interaction.guild.id,
            modId: interaction.member.user.id,
            userId: user.id,
            reason: reason
        });
        try {
        await newWarn.save();
        const warnEmbed = new EmbedBuilder()
        .setColor(colour)
        .setTitle('Sucessful warning')
        .setDescription(`Warned <@${user.id}> for **${reason}**`)
        .setTimestamp()
        if (dm.length === 0 || dm[0].value == 'true') {
            if (dm_val.length === 0) {
                await user.send(`You have been warned in **${interaction.guild.name}** for **${reason}** by <@${interaction.member.user.id}>`)
            } else {
            if (dm_val[0].value == '2') {
                await user.send(`You have been warned in **${interaction.guild.name}** for **${reason}**`)
            } else if (dm_val[0].value == '1') {
                await user.send(`You have been warned in **${interaction.guild.name}**`)
            } else  {
                await user.send(`You have been warned in **${interaction.guild.name}** for **${reason}** by <@${interaction.member.user.id}>`)
            }
        }
            await interaction.reply({ embeds: [warnEmbed]});
        } else {
            await interaction.reply({ embeds: [warnEmbed]});
        }
    
    } catch (error) {
        await interaction.reply(error.message);
        console.error(error)
        console.warn(`warn command failed.`)
    }
    }
		console.log('warn command - completed')
	},
};