const fs = require('fs')
const {EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');
const competitors = require("../competitors.json")
const fixtures = require('../fixtures.json')
const dayjs = require('dayjs')
let gameIndex = 0

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

		const finished = (error) => {
			if (error) {
				console.error(error)
				return
			}
		} 

		
		//ready eventlistener
		if (interaction.customId == "ready") {

			competitors.members.push({name: interaction.user.username, money: 1000})
			newCompetitors = JSON.stringify(competitors, null, 2)
			fs.writeFile("./competitors.json", newCompetitors, finished)


			interaction.reply({content: "**" + interaction.user.username + " joined the competition!**"})
		}

		// Betting eventListeners


		function getTime() {
            let time = fixtures.result[gameIndex].event_date + fixtures.result[gameIndex].event_time
            return dayjs(time).format("ddd H:mm")
        }

		function getEmbed() {
			const gameEmbed = new EmbedBuilder()
            .setColor('fe0303')
            .setThumbnail("https://proleague.be/dato/25478/1593507216-proleagueboxedlogogreenrgb.png")
            .addFields(
                { name: fixtures.result[gameIndex].event_home_team + " (" + fixtures.result[gameIndex].odds.odd_1 + "x)", value : "\u200B", inline: true},
                { name: "vs", value: "\u200B", inline: true},
                { name: fixtures.result[gameIndex].event_away_team + " (" + fixtures.result[gameIndex].odds.odd_2 + "x)", value : "\u200B", inline : true},
                { name: "\u200B", value: getTime() }
            )
			return gameEmbed
		}
		

		if (interaction.customId == "Back") {
			if(gameIndex == 0) {
				gameIndex = fixtures.result.length
			}
			
			gameIndex--
			
            await interaction.deferUpdate()
			await interaction.editReply({ embeds : [getEmbed()]})
		}

		if (interaction.customId == "Next") {
			if (gameIndex == fixtures.result.length - 1) {
				gameIndex = 0
			} else gameIndex++

			await interaction.deferUpdate()
			await interaction.editReply({ embeds : [getEmbed()]})
		}
		
		//Betting 

		 const Half = new ButtonBuilder()
                        .setCustomId('Half')
                        .setLabel('/2')
                        .setStyle(ButtonStyle.Primary)
        const Minus = new ButtonBuilder()
                        .setCustomId('Minus')
                        .setLabel("-50")
                        .setStyle(ButtonStyle.Primary)
        const Ready = new ButtonBuilder()
                        .setCustomId('Ready')
                        .setLabel("✅")
                        .setStyle(ButtonStyle.Success)
        const Plus = new ButtonBuilder()
                        .setCustomId('Plus')
                        .setLabel("+50")
                        .setStyle(ButtonStyle.Primary)
        const Double = new ButtonBuilder()
                        .setCustomId('Double')
                        .setLabel("x2")
                        .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
                .addComponents(Half, Minus, Ready, Plus, Double)

				function getBalance() {
				let balance = 0

				for (i = 0; i < competitors.members.length; i++) {
					if (interaction.user.username = competitors.members[i].name) {
						balance = competitors.members[i].money
					}
				}
				return balance
			}

		if (interaction.customId == "Home") {
			let bet = 100			
			const betEmbed = new EmbedBuilder()
				.setThumbnail(fixtures.result[gameIndex].home_team_logo)
				.setColor('fe0303')
				.addFields(
					{ name: "Home team ("+ fixtures.result[gameIndex].event_home_team + ")  to win (" + fixtures.result[gameIndex].odds.odd_1 + "x)", value: "\u200B"},
					{ name: "Inzet: $" + bet, value: "\u200B"},
					{ name: "\u200B", value: "Je hebt $" + getBalance()}
				)

				interaction.reply({embeds : [betEmbed], components: [row]})
		}

		if (interaction.customId == "Away") {
			let bet = 100			
			const betEmbed = new EmbedBuilder()
				.setThumbnail(fixtures.result[gameIndex].away_team_logo)
				.setColor('fe0303')
				.addFields(
					{ name: "Away team ("+ fixtures.result[gameIndex].event_away_team + ")  to win (" + fixtures.result[gameIndex].odds.odd_2 + "x)", value: "\u200B"},
					{ name: "Inzet: $" + bet, value: "\u200B"},
					{ name: "\u200B", value: "Je hebt $" + getBalance()}
				)

				interaction.reply({embeds : [betEmbed], components: [row]})
		}

		if (interaction.customId == "Draw") {
			let bet = 100			
			const betEmbed = new EmbedBuilder()
				.setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTfRBGrlYxPfDoEjncjbBZ5IOGjrsiPrTA4g&usqp=CAU")
				.setColor('fe0303')
				.addFields(
					{ name: "Draw between "+ fixtures.result[gameIndex].event_home_team + " and " +fixtures.result[gameIndex].event_away_team + " (" + fixtures.result[gameIndex].odds.odd_x + "x)", value: "\u200B"},
					{ name: "Inzet: $" + bet, value: "\u200B"},
					{ name: "\u200B", value: "Je hebt $" + getBalance()}
				)

				interaction.reply({embeds : [betEmbed], components: [row]})
		}


	},
};