const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios')
const fs = require('fs');
const dayjs = require('dayjs')

const APIkey = "81118c997285a4533bdac137c4818a55cdb5ffc9880ab4ba1e5a8cece77123b2"
const leagueId = "63"



module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('update'),
	async execute(interaction) {   
        
        
        let met = "Fixtures"
        const from = dayjs().format('YYYY-MM-DD')
        const to = dayjs().add(7, 'day').format('YYYY-MM-DD')

        const finished = (error) => {
			if (error) {
				console.error(error)
				return
			}
		} 
        
        axios.get('https://apiv2.allsportsapi.com/football', {
            params: {
                met,
                APIkey,
                leagueId,
                from,
                to
            }
        })
        .then(response => {
            let data = JSON.stringify(response.data, null, 2)
            fs.writeFile("./fixtures.json", data, finished)
        })

        met = "Odds"
        axios.get('https://apiv2.allsportsapi.com/football', {
            params: {
                met,
                APIkey,
                leagueId,
                from,
                to
            }
        }).then(response => {
            let keys = Object.keys(response.data.result)
            let matches = require('../fixtures.json')
            for (let j = 0; j < keys.length; j++) {
                for (let i = 0; i < response.data.result[keys[j]].length; i++) {
                    if (response.data.result[keys[j]][i].odd_bookmakers == "Betway") {
                        console.log(response.data.result[keys[j]][i].odd_1, response.data.result[keys[j]][i].odd_x, response.data.result[keys[j]][i].odd_2, response.data.result[keys[j]][i].match_id)
                        let odds = {
                            odd_1 : response.data.result[keys[j]][i].odd_1,
                            odd_x : response.data.result[keys[j]][i].odd_x,
                            odd_2 : response.data.result[keys[j]][i].odd_2
                        }

                        for (let h = 0; h < matches.result.length; h++) {
                            if (matches.result[h].event_key === response.data.result[keys[j]][i].match_id) {
                                matches.result[h].odds = odds
                                let matchesWithOdds = JSON.stringify(matches, null, 2)
                                fs.writeFile("./fixtures.json", matchesWithOdds, finished)
                            }
                        }

                    }
                }
            }            
        })
       


		await interaction.reply('**Fixtures van de opkomende week toegevoegd!**');
	},
};