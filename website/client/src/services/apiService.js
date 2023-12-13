const BASE_URL = "https://fantasy.premierleague.com/api/";

// Fetch general information from 'bootstrap-static'
export const fetchGeneralInfo = async () => {
    const response = await fetch(`${BASE_URL}bootstrap-static/`);
    return response.json();
};

// Fetch information about all fixtures
export const fetchFixtures = async () => {
    const response = await fetch(`${BASE_URL}fixtures/`);
    return response.json();
};

// Fetch detailed information about a specific player
export const fetchPlayerDetails = async (playerId) => {
    const response = await fetch(`${BASE_URL}element-summary/${playerId}/`);
    return response.json();
};

// Fetch performance of all players for a specified gameweek
export const fetchGameweekPerformance = async (gameweek) => {
    const response = await fetch(`${BASE_URL}event/${gameweek}/live/`);
    return response.json();
};

// Fetch information about an individual FPL manager
export const fetchManagerInfo = async (teamId) => {
    const response = await fetch(`${BASE_URL}entry/${teamId}/`);
    return response.json();
};

// Fetch transfer history of a manager
export const fetchManagerTransfers = async (teamId) => {
    const response = await fetch(`${BASE_URL}entry/${teamId}/transfers/`);
    return response.json();
};

// Fetch details of a manager's players for a given gameweek
export const fetchManagerPicks = async (teamId, gameweek) => {
    const response = await fetch(`${BASE_URL}entry/${teamId}/event/${gameweek}/picks/`);
    return response.json();
};

// Fetch a manager's historical performance
export const fetchManagerHistory = async (teamId) => {
    const response = await fetch(`${BASE_URL}entry/${teamId}/history/`);
    return response.json();
};

// Fetch standings of a classic FPL league
export const fetchClassicLeagueStandings = async (leagueId) => {
    const response = await fetch(`${BASE_URL}leagues-classic/${leagueId}/standings/`);
    return response.json();
};

// Fetch standings of a head-to-head FPL league
export const fetchH2HLeagueStandings = async (leagueId) => {
    const response = await fetch(`${BASE_URL}leagues-h2h-matches/league/${leagueId}/`);
    return response.json();
};