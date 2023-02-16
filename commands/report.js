const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Client, Events, GatewayIntentBits, ModalSubmitFields} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const mongoose = require('mongoose');
const Setting = require('../models/SettingsSchema');
const { colour } = require("../settings.json");
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report an issue.'),
	async execute(interaction) {
       
                const fields = {
                        summary: new TextInputBuilder()
                          .setCustomId(`summary`)
                          .setLabel(`Provide a summary of the issue.`)
                          .setStyle(TextInputStyle.Short)
                          .setRequired(true)
                          .setPlaceholder(`@abc did bad things`),
                        full: new TextInputBuilder()
                          .setCustomId(`full`)
                          .setLabel(`Add details to your report`)
                          .setStyle(TextInputStyle.Paragraph)
                          .setRequired(false)
                          .setPlaceholder(`@abc called me a stinky poopy pants.`)
                      }
                      
                      const modal = new ModalBuilder()
                        .setCustomId(`test_modal`)
                        .setTitle(`Report`)
                        .setComponents(
                          // Note that unlike how you might expect when sending a Message with Components,
                          // MessageActionRows for Modals **can only accept TextInputComponents** (no Buttons or
                          // SelectMenus or other Components), and each Action Row can have a maximum of just one
                          // TextInputComponent. You can have a maximum of 5 Action Rows in a Modal, so you have
                          // a maximum of 5 Text Inputs per Modal.
                          new ActionRowBuilder().setComponents(fields.summary),
                          new ActionRowBuilder().setComponents(fields.full),
                        )



        const channel = await Setting.find({ type: 3, guildId: interaction.guild.id });
        if (channel.length == 0) {
          await interaction.reply('Your admin has not set a report channel. Please ask them to do so.')
        } else {
        await interaction.showModal(modal);
        const channelId = channel[0].value
        const report_channel = await interaction.guild.channels.cache.find(channel => channel.id === channelId);
        const modalInteraction = await interaction.awaitModalSubmit({ time: 60_000 })
                
                        console.log(`${modalInteraction.customId} was submitted!`)
                // Get the data entered by the user
                        const summary = await modalInteraction.fields.getTextInputValue(`summary`)
                        const full = await modalInteraction.fields.getTextInputValue('full')
                
                const whyEmbed = new EmbedBuilder()
                .setColor(colour)
                .setTitle(`Report from ${interaction.user.id} (${interaction.user.username}): ${summary}`)
                .setDescription(full)
                .setTimestamp()
        
                await report_channel.send({ embeds: [whyEmbed] }),
                await modalInteraction.reply({ content: 'Thanks for your report.', ephemeral: true })
  
        }
        console.log('report command - completed')
}

}