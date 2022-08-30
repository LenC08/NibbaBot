const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fixtures = require('../fixtures.json')
const dayjs = require('dayjs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('wedden maar!'),
	async execute(interaction) {

        let gameIndex = 0

        function getTime() {
            let time = fixtures.result[gameIndex].event_date + fixtures.result[gameIndex].event_time
            return dayjs(time).format("ddd H:mm")
        }

        const gameEmbed = new EmbedBuilder()
            .setColor('fe0303')
            .setThumbnail("https://proleague.be/dato/25478/1593507216-proleagueboxedlogogreenrgb.png")
            .addFields(
                { name: fixtures.result[gameIndex].event_home_team + " (" + fixtures.result[gameIndex].odds.odd_1 + "x)", value : "\u200B", inline: true},
                { name: "vs", value: "\u200B", inline: true},
                { name: fixtures.result[gameIndex].event_away_team + " (" + fixtures.result[gameIndex].odds.odd_2 + "x)", value : "\u200B", inline : true},
                { name: "\u200B", value: getTime() }
            )
            

        const Home = new ButtonBuilder()
                        .setCustomId('Home')
                        .setLabel(fixtures.result[gameIndex].event_home_team)
                        .setStyle(ButtonStyle.Primary)
        const Draw = new ButtonBuilder()
                        .setCustomId('Draw')
                        .setLabel("Draw " + " " + fixtures.result[gameIndex].odds.odd_x + "x")
                        .setStyle(ButtonStyle.Danger)
        const Away = new ButtonBuilder()
                        .setCustomId('Away')
                        .setLabel(fixtures.result[gameIndex].event_away_team)
                        .setStyle(ButtonStyle.Primary)
        const Back = new ButtonBuilder()
                        .setCustomId('Back')
                        .setLabel("◀")
                        .setStyle(ButtonStyle.Secondary)
        const Next = new ButtonBuilder()
                        .setCustomId('Next')
                        .setLabel("▶")
                        .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
                .addComponents(Back, Home, Draw, Away, Next)
                

		await interaction.reply({ embeds: [gameEmbed], components: [row]});
	},
};