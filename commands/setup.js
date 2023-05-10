const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, SlashCommandBuilder, ChannelType} = require('discord.js');
const regex = require("../badwords.js");
const mongoose = require('mongoose');
const Setting = require('../models/SettingsSchema.js');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/loki', { useNewUrlParser: true, useUnifiedTopology: true, })


const { colour } = require("../settings.json");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription(`Setup features.`)
		        .addBooleanOption(option => option
				    .setName('automod')
				    .setDescription('Import badwords regex used in /check')
				      .setRequired(true))
            .addBooleanOption(option => option
              .setName('warning_dm')
              .setDescription('Send user DM when they are warned.')
                .setRequired(true))
            .addChannelOption(option => option
				    .setName('report_channel')
				    .setDescription('Report channnel')
				    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)),
	async execute(interaction) {
        const automod = interaction.options.getBoolean('automod')
        const warning_dm = interaction.options.getBoolean('warning_dm')

		interaction.defer()

		if (automod === true) {
			try {
			await interaction.guild.autoModerationRules.create({
				name: "Keyword block",
				creatorId: process.env.botId,
				enabled: true,
				eventType: 1,
				triggerType: 1,
				triggerMetadata:
				{
					keywordFilter: ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi\+ch", "biatch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "kill urself", "kys", "kill yourself", "kil urself", "l3i\+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!\+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi\+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"]
				},
				actions: [
					{
						type: 1,
						metadata: {
							channel: interaction.channel,
							durationSeconds: 10,
						}
					}
				]
			}).catch(async err => {
					console.log(err);
			});

			interaction.channel.send(':white_check_mark: AutoMod added')
		} catch(error) {
			interaction.channel.send(`:x: AutoMod failed to add: ${error.message}`)
		}
		}
		if (warning_dm === true) {
			await Setting.deleteMany({ guidldId: interaction.guild.id, type: 1 });
            const newSetting = new Setting({ 
                type: 1,
                value: true,
                guildId: interaction.guild.id
            });
            await newSetting.save();
			interaction.channel.send(':white_check_mark: Warning DM added')

		} else if (warning_dm === false ) {
			await Setting.deleteMany({ guidldId: interaction.guild.id, type: 1 });
            const newSetting = new Setting({ 
                type: 1,
                value: false,
                guildId: interaction.guild.id
            });
            await newSetting.save();
			interaction.channel.send(':x: Warning DM removed')
		}

		try {
			await Setting.deleteMany({ guidldId: interaction.guild.id, type: 5 });
            const channel = await interaction.options.getChannel('report_channel')
            const newSetting = new Setting({ 
                type: 3,
                value: channel.id,
                guildId: interaction.guild.id
            });
            await newSetting.save();
			interaction.channel.send(':white_check_mark: Report Channel added.')
    
		} catch(error) {
			interaction.channel.send(`:x: Report Channel failed to add: ${error.message}`)
		}
		interaction.editReply('Bot setup complete!')
},

}
