const { SlashCommandBuilder, EmbedBuilder, IntegrationExpireBehavior, PermissionsBitField, PermissionFlagsBits  } = require('discord.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const { colour } = require("../settings.json");
const Warn = require('../models/WarnSchema');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warns')
		.setDescription('Get the warnings from this guild.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Get the warnings from this guild.'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('user')
            .setDescription('Get the warnings for a user.')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User to check warns.')
                    .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await interaction.reply({ content: "You cannot see warns!", ephemeral: true })
        } else {
            if (interaction.options.getSubcommand() === "server") {
        try {
        const warnsGuild = await Warn.find({ guildId: interaction.guild.id });
        console.log(warnsGuild)
        let wLen = warnsGuild.length;

        let text = " ";
        for (let i = 0; i < wLen; i++) {
          text += '<@' + warnsGuild[i].userId + '> for ' + warnsGuild[i].reason + '\n';
        }

        const warnsEmbed = new EmbedBuilder()
            .setColor(colour)
            .setTitle('Warnings in this server:')
            .setDescription(text)
            .setTimestamp()    
        await interaction.reply({ embeds: [warnsEmbed]});
    } catch (error) {
        await interaction.reply(error.message);
        console.warn(`warns command failed.`)
    }
    } else if (interaction.options.getSubcommand() === "user") {
        const user = interaction.options.getUser("user")
        try {
        const warnsUser = await Warn.find({ guildId: interaction.guild.id, userId: user.id });
        console.log(warnsUser)
        let wLen = warnsUser.length;
        let text = "";
        for (let i = 0; i < wLen; i++) {
          text += '<@' + warnsUser[i].modId + '> warned <@' + warnsUser[i].userId + '> for ' + warnsUser[i].reason + ':\n**ID**: ' + warnsUser[i]._id + '\n\n';
        }

        const warnsEmbed = new EmbedBuilder()
            .setColor(colour)
            .setTitle(`Warnings for ${user.username}`)
            .setDescription(text)
            .setTimestamp()    
        await interaction.reply({ embeds: [warnsEmbed]});
        console.log('userwarns command - completed')
        } catch (error) {
            await interaction.reply(error.message);
            console.warn(`userwarns command failed.`)
        }
    } else {
        try {
            const warnsGuild = await Warn.find({ guildId: interaction.guild.id });
            console.log(warnsGuild)
            let wLen = warnsGuild.length;
            
        if (wLen <= 10) {
            let text = " ";
            for (let i = 0; i < wLen; i++) {
              text += '<@' + warnsGuild[i].userId + '> for ' + warnsGuild[i].reason + '\n';
            }
        } else {
            var pages = (wLen/10) 
        }
            const warnsEmbed = new EmbedBuilder()
                .setColor(colour)
                .setTitle('Warnings in this server:')
                .setDescription(text)
                .setTimestamp()    
            await interaction.reply({ embeds: [warnsEmbed]});
        } catch (error) {
            await interaction.reply(error.message);
            console.warn(`warns command failed.`)
        }
    }
		console.log('warns command - completed')
	}
},
}