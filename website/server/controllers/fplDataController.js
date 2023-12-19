
/**
 * fplDataController.js
 *
 * @description :: Server-side logic for fetching and parsing fpl data.
 */
const axios = require('axios');
const BASE_URL = "https://fantasy.premierleague.com/api/";

module.exports = {

    /**
     * fplDataController.getManagerData()
     */
    getManagerData: async function (req, res) {
        var managerId = req.params.id;

        /* fetch all data needed */
        const responseManagerData = await axios.get(`${BASE_URL}entry/${managerId}`);
        const responseGeneralInfoData = await axios.get(`${BASE_URL}bootstrap-static`);

        const managerData = responseManagerData.data; 
        const generalInfoTeams = responseGeneralInfoData.data.teams;
        const generalInfoEvents = responseGeneralInfoData.data.events;
        const generalInfoElements = responseGeneralInfoData.data.elements;

        const lastFinishedGameweek = generalInfoEvents
            .filter(gw => gw.finished)
            .reduce((acc, gw) => (gw.id > acc.id ? gw : acc), { id: -1 });

        const lastFinishedGameweekId = lastFinishedGameweek.id;

        const responseManagerPicks = await axios.get(`${BASE_URL}entry/${managerId}/event/${lastFinishedGameweekId}/picks/`);
        
        const managerPicks = responseManagerPicks.data.picks;

        const fav_team_id = managerData.favourite_team;
        const fav_team = generalInfoTeams[fav_team_id - 1].short_name;

        const players = generalInfoElements;

        let pickedPlayers = [];
        for (let i = 0; i < managerPicks.length; i++) {
            const filteredPlayer = players.filter(player => player.id === managerPicks[i].element)[0]
            pickedPlayers.push({first_name: filteredPlayer.first_name, second_name: filteredPlayer.second_name, element_type: filteredPlayer.element_type});
        }

        /* jsonResponse */
        const jsonResponse = {
            manager_first_name: managerData.player_first_name,
            manager_second_name: managerData.player_last_name,
            country: managerData.player_region_iso_code_long,
            favourite_team: fav_team,
            current_rank: managerData.summary_overall_rank,
            total_points: managerData.summary_overall_points,
            players: pickedPlayers
        }

        return res.json(jsonResponse);
    }
};
