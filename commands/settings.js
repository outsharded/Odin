const { SlashCommandBuilder, EmbedBuilder, GatewayIntentBits, PermissionsBitField, PermissionFlagsBits, Client, ChannelType } = require('discord.js');
const fs = require("fs");
const mongoose = require('mongoose');
const Setting = require('../models/SettingsSchema');
const { colour } = require("../settings.json");
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Change the settings for the bot.')
.addSubcommandGroup(subcommand =>
            subcommand
                .setName('warn_dm')
                .setDescription('Settings related to users being dmed after being warned.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('warning_dm')
                .setDescription('wether to send user a DM after thye have been warned.')
                .addBooleanOption(option =>
                    option
                        .setName('dm')
                        .setDescription('true to send DM (default), false to not send.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('warning_dm_level')
                .setDescription('What information showuld be given to the user in DM')
                .addIntegerOption(option =>
                    option
                        .setName('dm_level')
                        .setDescription('Level of information given to user.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Server', value: 1 },
                            { name: 'Server and Reason', value: 2 },
                            { name: 'Server, Reason and Moderator (default)', value: 3 },
                        ))))
.addSubcommandGroup(subcommand =>
                                                                                        subcommand
                                                                                            .setName('report')
                                                                                            .setDescription('Settings related to users being dmed after being warned.')
                                                                                    .addSubcommand(subcommand =>
                                                                                        subcommand
                                                                                            .setName('report_channel')
                                                                                            .setDescription('Channel to send reports to.')
                                                                                            .addChannelOption(option =>
                                                                                                option
                                                                                                    .setName('channel')
                                                                                                    .setDescription('Channel to send report to.')
                                                                                                    .setRequired(true)
                                                                                                    .addChannelTypes(ChannelType.GuildText)))
                                                                                                    )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            await interaction.reply({ content: "You are not allowed to modify settings!", ephemeral: true })
        } else {
            
    try {
        if (interaction.options.getSubcommand() === "warning_dm") {
            await Setting.deleteMany({ guidldId: interaction.guild.id, type: 1 });
            const newSetting = new Setting({ 
                type: 1,
                value: interaction.options.getBoolean('dm'),
                guildId: interaction.guild.id
            });
            await newSetting.save();
            const settingEmbed = new EmbedBuilder()
                .setColor(colour)
                .setTitle('Sucessful setting')
                .setDescription(`Set warning_dm to ${interaction.options.getBoolean('dm')}`)
                .setTimestamp()
            await interaction.reply({ embeds: [settingEmbed], ephemeral: true });

        } else if (interaction.options.getSubcommand() === "warning_dm_level") {
        await Setting.deleteMany({ guidldId: interaction.guild.id, type: 2 });
        const newSetting = new Setting({ 
            type: 2,
            value: interaction.options.getInteger('dm_level'),
            guildId: interaction.guild.id
        });
        await newSetting.save();
        const settingEmbed = new EmbedBuilder()
            .setColor(colour)
            .setTitle('Sucessful setting')
            .setDescription(`Set warning_dm_level to ${interaction.options.getInteger('dm_level')}`)
            .setTimestamp()
        await interaction.reply({ embeds: [settingEmbed], ephemeral: true });

        } else if (interaction.options.getSubcommand() === "report_channel") {
            await Setting.deleteMany({ guidldId: interaction.guild.id, type: 5 });
            const channel = await interaction.options.getChannel('channel')
            const newSetting = new Setting({ 
                type: 3,
                value: channel.id,
                guildId: interaction.guild.id
            });
            await newSetting.save();
            const settingEmbed = new EmbedBuilder()
                .setColor(colour)
                .setTitle('Sucessful setting')
                .setDescription(`Set report channel to to ${interaction.options.getChannel('channel')}`)
                .setTimestamp()
            await interaction.reply({ embeds: [settingEmbed], ephemeral: true });
    
    
    
            } 
    } catch (error) {
        await interaction.reply(error.message);
        console.error(error.message)
        console.warn(`setting command failed.`)
    }
    console.log('setting command completed.')
    }
        },
		
	}

   