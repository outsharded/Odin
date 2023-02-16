const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { OPENAI_API_KEY } = require("../config.json");
const mongoose = require('mongoose');
const Setting = require('../models/SettingsSchema');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const { colour } = require("../settings.json");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription(`Use AI to check wheter a message is offensive.`)
		        .addStringOption(option => option
				    .setName('message_id')
				    .setDescription('The ID of the message that you would like to be checked.')
				    .setRequired(true))
                .addChannelOption(option => option
				    .setName('channel')
				    .setDescription('The channel the messsage was sent to.')
				    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)),
	async execute(interaction) {
        const channel = await interaction.options.getChannel("channel")
        const message = await channel.messages.fetch(interaction.options.getString("message_id"))
        console.log(message)
        const response = await openai.createModeration({
            input: message.content,
          });
          console.log(response)

        if (response.data.results[0].flagged == false) {
        interaction.reply({ content: `This message was not classed as offensive.`, ephemeral: true}) 
    	} else if (response.data.results[0].flagged == true) {
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
                await message.delete('Classed as offensive by a user-triggered AI check of the message.')
                interaction.reply({ content: `This message was classed as offensive and will be deleted.`, ephemeral: true, fetchReply: true})

            } catch(error) {
                interaction.reply({ content: `This message was classed as offensive, however I could not delete it due to ${error.message}. Please report this error to an Admin.`, ephemeral: true})
                

            }
        }
},

}
