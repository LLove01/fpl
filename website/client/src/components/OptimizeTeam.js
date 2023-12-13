import React, { useState, useEffect } from 'react';
import { fetchManagerInfo, fetchGeneralInfo, fetchManagerPicks, fetchFixtures, fetchGameweekPerformance } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const OptimizeTeam = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const managerId = user.managerId;
    const [managerInfo, setManagerInfo] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [managerPicks, setManagerPicks] = useState([]);
    const [currentGameweek, setCurrentGameweek] = useState(null); // State to store the current gameweek
    const [fixtures, setFixtures] = useState([]);
    const [gameweekPerformance, setGameweekPerformance] = useState([]);
    const [proposedTransfersNet, setProposedTransfersNet] = useState([]);
    const [proposedTransfersICT, setProposedTransfersICT] = useState([]);
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

                const currentGW = generalInfo.events.find(gw => gw.is_current);
                setCurrentGameweek(currentGW);
                setError(null);
            } catch (err) {
                setError('Failed to fetch static data. Please ensure the manager ID is correct.');
            }
        };

        fetchStaticData();
    }, [managerId]);

    useEffect(() => {
        const fetchDynamicData = async () => {
            if (!currentGameweek) return;

            setLoading(true);
            try {
                const picks = await fetchManagerPicks(managerId, currentGameweek.id);
                const allFixtures = await fetchFixtures();
                const performance = await fetchGameweekPerformance(currentGameweek.id);
                setManagerPicks(picks.picks);
                setFixtures(allFixtures);
                setGameweekPerformance(performance.elements);
            } catch (err) {
                console.error("Failed to fetch dynamic data:", err);
            }
            setLoading(false);
        };

        fetchDynamicData();
    }, [managerId, currentGameweek]);

    useEffect(() => {
        if (players.length && managerPicks.length) {
            const currentTeamPlayerIds = new Set(managerPicks.map(pick => pick.element));

            // Net Transfers
            const teamPlayersWithNetTransfers = managerPicks.map(pick => {
                const player = players.find(p => p.id === pick.element);
                return {
                    ...player,
                    netTransfers: player.transfers_in_event - player.transfers_out_event
                };
            });

            const lowestNetTransfersPlayers = teamPlayersWithNetTransfers.sort((a, b) => a.netTransfers - b.netTransfers).slice(0, 3);

            const transfersNet = lowestNetTransfersPlayers.map(player => {
                const sortedPlayersByNetTransfers = [...players].filter(p =>
                    p.element_type === player.element_type && !currentTeamPlayerIds.has(p.id)
                ).sort((a, b) => (b.transfers_in_event - b.transfers_out_event) - (a.transfers_in_event - a.transfers_out_event));

                const proposedTransfer = sortedPlayersByNetTransfers.length ? sortedPlayersByNetTransfers[0] : null;
                return proposedTransfer ? `${player.first_name} ${player.second_name} -> ${proposedTransfer.first_name} ${proposedTransfer.second_name}` : null;
            }).filter(transfer => transfer !== null);

            setProposedTransfersNet(transfersNet);

            // ICT Index
            const teamPlayersWithICT = managerPicks.map(pick => {
                const player = players.find(p => p.id === pick.element);
                return {
                    ...player,
                    ictIndex: parseFloat(player.ict_index)
                };
            });

            const lowestICTPlayers = teamPlayersWithICT.sort((a, b) => a.ictIndex - b.ictIndex).slice(0, 3);

            const transfersICT = lowestICTPlayers.map(player => {
                const sortedPlayersByICT = [...players].filter(p =>
                    p.element_type === player.element_type && !currentTeamPlayerIds.has(p.id)
                ).sort((a, b) => parseFloat(b.ict_index) - parseFloat(a.ict_index));

                const proposedTransfer = sortedPlayersByICT.length ? sortedPlayersByICT[0] : null;
                return proposedTransfer ? `${player.first_name} ${player.second_name} -> ${proposedTransfer.first_name} ${proposedTransfer.second_name}` : null;
            }).filter(transfer => transfer !== null);

            setProposedTransfersICT(transfersICT);
        }
    }, [players, managerPicks]);

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
        if (!players.length || !fixtures.length || !currentGameweek) {
            console.log("No players, fixtures, or current gameweek data available");
            return 'N/A';
        }

        const player = players.find(player => player.id === playerId);
        if (!player) {
            console.log(`No player found for player ID: ${playerId}`);
            return 'N/A';
        }

        const playerTeamCode = player.team;
        console.log(`Player Team Code: ${playerTeamCode}`);

        const fixtureForGameweek = fixtures.filter(f => f.event === currentGameweek.id);
        console.log(`Filtered Fixtures for Gameweek ${currentGameweek.id}:`, fixtureForGameweek);

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
        <div className="optimize-team-container m-3">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : managerInfo ? (
                <>
                    <h3>Current Team for Gameweek {currentGameweek?.id}</h3>
                    <table className="table-container">
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
                    <div>
                        <h2>Proposed Transfers</h2>
                        <div>
                            <h3>Go with the flow</h3>
                            <ul>
                                {proposedTransfersNet.map((transfer, index) => (
                                    <li key={index}>{transfer}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>Maximize ICT</h3>
                            <ul>
                                {proposedTransfersICT.map((transfer, index) => (
                                    <li key={index}>{transfer}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </>
            ) : (
                <p>No profile data available.</p>
            )
            }
        </div >
    );
};

export default OptimizeTeam;
