import React, { useState, useEffect } from 'react';
import { fetchClassicLeagueStandings } from '../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';

const Leagues = () => {
    const { league_id } = useParams();
    const [leagueData, setLeagueData] = useState([]);
    const [leagueName, setLeagueName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchClassicLeagueStandings(league_id);
                setLeagueData(response.standings.results);
                setLeagueName(response.league.name);
                setError(null);
            } catch (err) {
                setError('Failed to fetch league data. Please ensure the league ID is correct.');
            }
        };

        fetchData();
    }, [league_id]);

    return (
        <div className="table-container">
            <h2>{leagueName} League Standings</h2>
            {error ? (
                <p>{error}</p>
            ) : (
                <LeagueTable data={leagueData} />
            )}
        </div>
    );
};

const LeagueTable = ({ data }) => {
    const navigate = useNavigate();
    const handleRowClick = (managerId) => {
        //navigate(`/find_manager/${managerId}`);
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Manager</th>
                    <th>Points</th>
                    <th>Rank Change</th>
                </tr>
            </thead>
            <tbody>
                {data.map(entry => (
                    <tr key={entry.entry} onClick={() => handleRowClick(entry.entry)}>
                        <td>{entry.rank}</td>
                        <td>{entry.entry_name}</td>
                        <td>{entry.player_name}</td>
                        <td>{entry.total}</td>
                        <td>
                            {/* Rank change logic */}
                            {entry.rank_sort - entry.last_rank === 0 ? (
                                '•'
                            ) : entry.rank_sort - entry.last_rank > 0 ? (
                                <>
                                    <span>↓ </span>
                                    {entry.rank_sort - entry.last_rank}
                                </>
                            ) : (
                                <>
                                    <span>↑ </span>
                                    {Math.abs(entry.rank_sort - entry.last_rank)}
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Leagues;
