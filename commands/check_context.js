const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder} = require('discord.js');
const regex = require("../badwords.js");
const mongoose = require('mongoose');
const Setting = require('../models/SettingsSchema.js');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })


const { colour } = require("../settings.json");
module.exports = {
	data: new ContextMenuCommandBuilder()
	.setName('Check message.')
	.setType(ApplicationCommandType.Message),
	async execute(interaction) {
        const channel = await Setting.find({ type: 3, guildId: interaction.guild.id });
        const message = await interaction.targetMessage;
        const bad = regex.test(message.content)

        if (bad == false) {
            interaction.reply({ content: `This message was **not** classed as offensive and has **not** been deleted. If you believe this is word should be blocked, DM <@798929927318536263>.`, ephemeral: true})
            
    	} else if (bad == true) {
            try {
            await message.delete('Classed as offensive by a user-triggered check of the message.')
            interaction.reply({ content: `This message was classed as offensive and has been deleted.`, ephemeral: true})
            } catch(error) {
                interaction.reply({ content: `Errored: ${error.message}`, ephemeral: true })
                const channelId = channel[0].value
                const report_channel = await interaction.guild.channels.cache.find(channel => channel.id === channelId);
              report_channel.send({ content: `${message} from ${message.author.username}: (${message.author.id}) was classed as offensive, however I could not delete it due to ${error.message}.`, ephemeral: true})
                console.error(error)
            }
            try {
            const channel = await Setting.find({ type: 3, guildId: interaction.guild.id });
            if (channel.length == 0) {
                  return;
            } else {
                const channelId = channel[0].value
                const report_channel = await interaction.guild.channels.cache.find(channel => channel.id === channelId);

                        const whyEmbed = new EmbedBuilder()
                            .setColor(colour)
                            .setTitle(`Offensive message:`)
                            .setDescription(`Sent by ${message.author}: ${message.content}`)
                            .setTimestamp()
                        await report_channel.send({ embeds: [whyEmbed] })
            }
            
                
            } catch(error) {
                if (channel.length == 0) {
                    return;
              } else {
                  const channelId = channel[0].value
                  const report_channel = await interaction.guild.channels.cache.find(channel => channel.id === channelId);
                report_channel.send({ content: `${message} from ${message.author.username}: (${message.author.id}) was classed as offensive, however I could not delete it due to ${error.message}.`, ephemeral: true})
              }

            }
        }
},

}
