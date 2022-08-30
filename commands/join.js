const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const competitors = require("../competitors.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Compete with other guild members!'),
	async execute(interaction) {

        for (let i = 0; i < competitors.members.length; i++) {
            if (competitors.members[i].data.username == interaction.user.username) {
                interaction.reply({content : "**Jij doet al mee!**", ephemeral: true})
                return
            }
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ready")
                    .setLabel("👍")
                    .setStyle(ButtonStyle.Success)
            )


		await interaction.reply({content: '**Want to join the competition?**', components: [row], ephemeral: true});
	},
};