import React, { useState, useEffect } from 'react';
import { fetchManagerInfo, fetchGeneralInfo, fetchManagerPicks, fetchFixtures, fetchGameweekPerformance } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const managerId = user.managerId;
    const [managerInfo, setManagerInfo] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [managerPicks, setManagerPicks] = useState([]);
    const [selectedGameweek, setSelectedGameweek] = useState(1);
    const [gameweeks, setGameweeks] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [gameweekPerformance, setGameweekPerformance] = useState([]);
    const [gameweekRanks, setGameweekRanks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaticData = async () => {
            try {
                const info = await fetchManagerInfo(managerId);
                const generalInfo = await fetchGeneralInfo();
                setManagerInfo(info);
                setTeams(generalInfo.teams);
                setPlayers(generalInfo.elements);
                setGameweeks(generalInfo.events);
                setError(null);
            } catch (err) {
                setError('Failed to fetch static data. Please ensure the manager ID is correct.');
            }
        };

        fetchStaticData();
    }, [managerId]);

    useEffect(() => {
        const fetchDynamicData = async () => {
            setLoading(true);
            try {
                const picks = await fetchManagerPicks(managerId, selectedGameweek);
                const allFixtures = await fetchFixtures();
                const performance = await fetchGameweekPerformance(selectedGameweek);
                setManagerPicks(picks.picks);
                setFixtures(allFixtures);
                setGameweekPerformance(performance.elements);
            } catch (err) {
                console.error("Failed to fetch dynamic data:", err);
            }
            setLoading(false);
        };

        fetchDynamicData();
    }, [managerId, selectedGameweek]);

    useEffect(() => {
        const fetchGameweekRanks = async () => {
            const ranks = [];
            for (let gw = 1; gw <= gameweeks.length; gw++) {
                try {
                    const picks = await fetchManagerPicks(managerId, gw);
                    ranks.push({ gameweek: gw, rank: picks.entry_history.overall_rank });
                } catch (err) {
                    console.error(`Failed to fetch data for gameweek ${gw}:`, err);
                }
            }
            setGameweekRanks(ranks);
        };

        if (gameweeks.length > 0) {
            fetchGameweekRanks();
        }
    }, [gameweeks, managerId]);

    useEffect(() => {
        const fetchDynamicData = async () => {
            setLoading(true);
            try {
                const picks = await fetchManagerPicks(managerId, selectedGameweek);
                const allFixtures = await fetchFixtures();
                console.log("Selected Gameweek:", selectedGameweek); // Add this line
                console.log("Fetched Fixtures:", allFixtures); // Add this line
                const performance = await fetchGameweekPerformance(selectedGameweek);
                setManagerPicks(picks.picks);
                setFixtures(allFixtures);
                setGameweekPerformance(performance.elements);
            } catch (err) {
                console.error("Failed to fetch dynamic data:", err);
            }
            setLoading(false);
        };

        fetchDynamicData();
    }, [managerId, selectedGameweek]);

    const getTeamCode = (teamId, fromPlayers = false) => {
        if (fromPlayers) {
            const player = players.find(p => p.id === teamId);
            if (!player) return 'N/A';
            teamId = player.team;
        }

        const team = teams.find(t => t.id === teamId);
        return team ? team.short_name : 'N/A';
    };

    const getOpponentTeamCode = (playerId) => {
        if (!players.length || !fixtures.length) {
            console.log("No players or fixtures available");
            return 'N/A'; // Ensure data is available
        }

        const player = players.find(player => player.id === playerId);
        if (!player) {
            console.log(`No player found for player ID: ${playerId}`);
            return 'N/A';
        }

        const playerTeamCode = player.team; // Get the team code of the player
        console.log(`Player Team Code: ${playerTeamCode}`);

        const selectedGameweekNumber = parseInt(selectedGameweek, 10); // Convert to number if it's a string
        const fixtureForGameweek = fixtures.filter(f => f.event === selectedGameweekNumber);

        console.log(`Filtered Fixtures for Gameweek ${selectedGameweekNumber}:`, fixtureForGameweek);

        const fixture = fixtureForGameweek.find(f => f.team_a === playerTeamCode || f.team_h === playerTeamCode);

        if (!fixture) {
            console.log(`No fixture found for player team code: ${playerTeamCode}`);
            return 'N/A';
        }

        const opponentTeamId = fixture.team_a === playerTeamCode ? fixture.team_h : fixture.team_a;
        console.log(`Opponent Team ID: ${opponentTeamId}`);
        return getTeamCode(opponentTeamId);
    };

    const getPositionCode = (playerId) => {
        const player = players.find(p => p.id === playerId);
        if (!player) return 'N/A';

        const positionCodes = {
            1: 'GKP',
            2: 'DEF',
            3: 'MID',
            4: 'FWD'
        };

        return positionCodes[player.element_type] || 'N/A';
    };

    const getPlayerDetails = (playerId) => {
        return players.find(p => p.id === playerId) || {};
    };

    const getPlayerPoints = (playerId) => {
        const performance = gameweekPerformance.find(p => p.id === playerId);
        return performance ? performance.stats.total_points : 'N/A';
    };

    const getRankChangeSymbol = (currentRank, lastRank) => {
        const difference = lastRank - currentRank;
        if (difference > 0) {
            return `↑ ${Math.abs(difference)}`;
        } else if (difference < 0) {
            return `↓ ${Math.abs(difference)}`;
        } else {
            return '•';
        }
    };

    const handleLeagueRowClick = (leagueId) => {
        navigate(`/leagues/${leagueId}`);
    };


    return (
        <div className="profile-container m-3">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : managerInfo ? (
                <>
                    <h2>Profile</h2>
                    <div className="manager-info">
                        <p><strong>Manager Name:</strong> {managerInfo.player_first_name} {managerInfo.player_last_name}</p>
                        <p><strong>Team Name:</strong> {managerInfo.name}</p>
                        <p><strong>Country:</strong> {managerInfo.player_region_iso_code_long}</p>
                        <p><strong>Favourite Team:</strong> {getTeamCode(managerInfo.favourite_team)}</p>
                        <p><strong>Total Points:</strong> {managerInfo.summary_overall_points}</p>
                        <p><strong>Overall Rank:</strong> {managerInfo.summary_overall_rank}</p>
                        {/* Add more profile details as needed */}
                    </div>
                    <h3>Leagues Joined</h3>
                    <table className="table-container">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managerInfo.leagues.classic.map(league => (
                                <tr key={league.id} onClick={() => handleLeagueRowClick(league.id)}>
                                    <td>{league.name}</td>
                                    <td>{league.entry_rank}</td>
                                </tr>

                            ))}
                        </tbody>
                    </table>


                    <h3>Manager Picks for Gameweek {selectedGameweek}</h3>
                    <select value={selectedGameweek} onChange={e => setSelectedGameweek(e.target.value)}>
                        {gameweeks
                            .filter(gw => gw.finished) // Filter to include only finished gameweeks
                            .map(gw => (
                                <option key={gw.id} value={gw.id}>Gameweek {gw.id}</option>
                            ))
                        }
                    </select>
                    <table className="table-container"> {/* Apply the className here */}
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Position</th>
                                <th>Team</th>
                                <th>Opponent</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managerPicks.map(pick => {
                                const playerDetails = getPlayerDetails(pick.element);
                                let playerName = `${playerDetails.first_name} ${playerDetails.second_name}`;

                                if (pick.is_captain) {
                                    playerName += " (C)";
                                } else if (pick.is_vice_captain) {
                                    playerName += " (V)";
                                }

                                return (
                                    <tr key={pick.element}>
                                        <td>{playerName}</td>
                                        <td>{getPositionCode(pick.element)}</td>
                                        <td>{getTeamCode(pick.element, true)}</td>
                                        <td>{getOpponentTeamCode(pick.element)}</td>
                                        <td>{getPlayerPoints(pick.element)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <h3>Gameweek Rank Progression</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            width={500}
                            height={300}
                            data={gameweekRanks}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="gameweek" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="rank" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>

                </>
            ) : (
                <p>No profile data available.</p>
            )
            }
        </div >
    );
};

export default Profile;
