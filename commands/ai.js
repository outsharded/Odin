const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { OPENAI_API_KEY } = require("../config.json");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const { colour } = require("../settings.json");
//const bannedIDs = []

//was woman command. got dewomanised. bleeding heart liberals, ey?
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ai')
		.setDescription(`Use OpenAI's DALL-E, GPT-3 and Codex engines to generate text, images and code!`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('text')
                .setDescription('Use the AI GPT-3 to create text. (Capped at approx. 200 words)')
		        .addStringOption(option => option
				    .setName('prompt')
				    .setDescription('Write a prompt to give to the AI. Keep it short and desciptive.')
				    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
            .setName('image')
            .setDescription('Use the OpenAI DALL-E to create images!')
            .addStringOption(option => option
                .setName('prompt')
                .setDescription('Write a prompt to give to the AI. Make it short and descriptive.')
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('code')
                .setDescription('Use the Codex engine to create code.')
                .addStringOption(option => option
                    .setName('prompt')
                    .setDescription('Write a prompt to give to the AI. Keep it short and desciptive.')
                    .setRequired(true))),
	async execute(interaction) {
//		if (bannedIDs.includes(interaction.user.id)) {
			// If user is in list, stop the
//			await interaction.reply({ content: `You're banned from this command.`, ephemeral: true });
//		} else {
    const prompt = interaction.options.getString('prompt')
    if (interaction.options.getSubcommand() === "text") {
		try {
			const completion = await openai.createCompletion({
					"model": "text-babbage-001",
					"prompt": prompt,
					"temperature": .4,
					"max_tokens": 500,
					"user": interaction.user.id
			})
			const madeEmbed = new EmbedBuilder()
			.setColor(colour)
			.setTitle(`${prompt}:`)
			.setDescription(completion.data.choices[0].text)
			.setTimestamp()
			.setFooter({ text: `We use OpenAI's GPT-3 to generate text!` });
			interaction.reply({ embeds: [madeEmbed], fetchReply: true  });
			//log report in console
			console.warn(`${interaction.user.id} ${interaction.user.username} Input:${prompt} Output: ${completion.data.choices[0].text}`)
			console.log('Text command - completed')
		} catch (error) {
			await interaction.reply(error.message);
			console.warn(`Text command failed.`)
		}
//	}

    	} else if (interaction.options.getSubcommand() === "code") {
            const makingEmbed = new EmbedBuilder()
                .setColor(colour)
                .setTitle(`Generating: ${prompt}`)
                .setTimestamp()
                .setFooter({ text: `We use OpenAI's Codex engine to generate code!` });      
    //        const sent = 
            await interaction.reply({ embeds: [makingEmbed] });
                try {
                    const completion = await openai.createCompletion({
                        "model": "code-cushman-001",
                        "prompt": prompt,
                        "temperature": .9,
                        "max_tokens": 200,
                        "user": interaction.user.id
                    })
                    const madeEmbed = new EmbedBuilder()
                    .setColor(colour)
                    .setTitle(`I generated: ${prompt}`)
                    .setDescription(completion.data.choices[0].text)
                    .setTimestamp()
                    .setFooter({ text: `We use OpenAI's Codex engine to generate code!` });
                    interaction.editReply({ embeds: [madeEmbed] });
                //log report in console
                    console.warn(`${interaction.user.id} ${interaction.user.username} Input:${prompt} Output: ${completion.data.choices[0].text}`)
                    console.log('code command - completed')
                } catch (error) {
                    await interaction.editReply(error.message);
                    console.warn(`Code command failed.`)
                }
        } else if (interaction.options.getSubcommand() === "image") {
            const makingEmbed = new EmbedBuilder()
			.setColor(colour)
				.setTitle('Generating Image')
			.setDescription(prompt)
			.setTimestamp()
    		.setFooter({ text: `We use OpenAI's DALL-E to generate images!` });      
//        const sent = 
		await interaction.reply({ embeds: [makingEmbed] });
		try {
        	const response = await openai.createImage({
            	    prompt: prompt,
                	n: 1,
                	size: "256x256",
					user: interaction.user.id
        	});
		const madeEmbed = new EmbedBuilder()
			.setColor(colour)
			.setTitle('Generated Image')
			.setDescription(prompt)
			.setImage(response.data.data[0].url)
			.setTimestamp()
    		.setFooter({ text: `We use OpenAI's DALL-E to generate images!` });
//Logging and reponse			
        	console.log(response.data.data[0].url)
        	interaction.editReply({ embeds: [madeEmbed], fetchReply: true  });
			console.warn(`${interaction.user.id} ${interaction.user.username} Input:${prompt} Output: ${response.data.data[0].url}`)
			console.log('Image command - completed')
	} catch (error) {
		await interaction.editReply(error.message);
		console.warn(`Image command failed.`)
	}
        } else {
            interaction.reply("Error. Did you specify text ,code or image?")
        }
    	},
};

