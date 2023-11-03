import React, { useState, useEffect } from 'react';
import { fetchGeneralInfo, fetchFixtures } from '../services/apiService';

const TeamInsights = () => {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [fixtures, setFixtures] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const generalInfo = await fetchGeneralInfo();
            const allFixtures = await fetchFixtures();

            setTeams(generalInfo.teams);
            setPlayers(generalInfo.elements);
            setFixtures(allFixtures);
        };

        fetchData();
    }, []);

    const calculateTeamTotalPoints = (teamId) => {
        return players
            .filter(player => player.team === teamId)
            .reduce((total, player) => total + player.total_points, 0);
    }

    const getTopScorer = (teamId) => {
        const teamPlayers = players.filter(player => player.team === teamId);
        if (teamPlayers.length === 0) return 'N/A'; // Handle the case where there are no players for a team

        const topScorer = teamPlayers.reduce((prev, current) => (prev.total_points > current.total_points) ? prev : current);
        return topScorer.first_name + ' ' + topScorer.second_name;
    }


    const getNextThreeOpponents = (teamId) => {
        const upcomingFixtures = fixtures.filter(fixture => (fixture.team_a === teamId || fixture.team_h === teamId) && !fixture.finished);
        const nextThree = upcomingFixtures.slice(0, 3);
        return nextThree.map(fixture => {
            return fixture.team_a === teamId ? teams.find(team => team.id === fixture.team_h).short_name : teams.find(team => team.id === fixture.team_a).short_name;
        }).join(', ');
    }

    return (
        <div className="table-container">
            <h2>Team Insights</h2>
            <table>
                <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>Team Strength</th>
                        <th>Total Points</th>
                        <th>Top Scorer</th>
                        <th>Next 3 Opponents</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map(team => (
                        <tr key={team.id}>
                            <td>{team.name}</td>
                            <td>{team.strength}</td>
                            <td>{calculateTeamTotalPoints(team.id)}</td>
                            <td>{getTopScorer(team.id)}</td>
                            <td>{getNextThreeOpponents(team.id)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeamInsights;
