import React, { useState, useEffect } from 'react';
import { fetchGeneralInfo } from '../services/apiService';

const PlayerAnalysis = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const generalInfo = await fetchGeneralInfo();
            setPlayers(generalInfo.elements);
            setTeams(generalInfo.teams);
        };

        fetchData();
    }, []);

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team ? team.short_name : '';
    };

    const handleColumnClick = (columnName) => {
        if (sortedColumn === columnName) {
            setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortedColumn(columnName);
            setSortDirection('asc');
        }
    };

    const sortedPlayers = [...players].sort((a, b) => {
        let comparison = 0;

        switch (sortedColumn) {
            case 'name':
                comparison = `${a.first_name} ${a.second_name}`.localeCompare(`${b.first_name} ${b.second_name}`);
                break;
            case 'team':
                comparison = getTeamName(a.team).localeCompare(getTeamName(b.team));
                break;
            case 'points':
                comparison = a.total_points - b.total_points;
                break;
            case 'price':
                comparison = a.now_cost - b.now_cost;
                break;
            case 'ppm':
                comparison = (a.total_points / (a.now_cost / 10)) - (b.total_points / (b.now_cost / 10));
                break;
            case 'ict':
                comparison = parseFloat(a.ict_index) - parseFloat(b.ict_index);
                break;
            default:
                break;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const displayedPlayers = sortedPlayers.filter(player =>
        `${player.first_name} ${player.second_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Player Analysis</h2>
            <input
                type="text"
                placeholder="Search player..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className={`sortable ${sortedColumn === 'name' ? 'active' : ''}`} onClick={() => handleColumnClick('name')}>Player Name</th>
                            <th className={`sortable ${sortedColumn === 'team' ? 'active' : ''}`} onClick={() => handleColumnClick('team')}>Team</th>
                            <th className={`sortable ${sortedColumn === 'points' ? 'active' : ''}`} onClick={() => handleColumnClick('points')}>Points</th>
                            <th className={`sortable ${sortedColumn === 'price' ? 'active' : ''}`} onClick={() => handleColumnClick('price')}>Price (£)</th>
                            <th className={`sortable ${sortedColumn === 'ppm' ? 'active' : ''}`} onClick={() => handleColumnClick('ppm')}>Price per Million</th>
                            <th className={`sortable ${sortedColumn === 'ict' ? 'active' : ''}`} onClick={() => handleColumnClick('ict')}>ICT Index</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedPlayers.map(player => (
                            <tr key={player.id}>
                                <td>{player.first_name} {player.second_name}</td>
                                <td>{getTeamName(player.team)}</td>
                                <td>{player.total_points}</td>
                                <td>{(player.now_cost / 10).toFixed(1)}</td>
                                <td>{(player.total_points / (player.now_cost / 10)).toFixed(2)}</td>
                                <td>{player.ict_index}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerAnalysis;
