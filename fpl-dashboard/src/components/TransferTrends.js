import React, { useState, useEffect } from 'react';
import { fetchGeneralInfo } from '../services/apiService';

const TransferTrends = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchData = async () => {
            const generalInfo = await fetchGeneralInfo();
            setPlayers(generalInfo.elements);
            setTeams(generalInfo.teams);
        };

        fetchData();
    }, []);

    const getTeamShortName = (teamId) => {
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
                comparison = getTeamShortName(a.team).localeCompare(getTeamShortName(b.team));
                break;
            case 'in':
                comparison = a.transfers_in_event - b.transfers_in_event;
                break;
            case 'out':
                comparison = a.transfers_out_event - b.transfers_out_event;
                break;
            case 'net':
                comparison = (a.transfers_in_event - a.transfers_out_event) - (b.transfers_in_event - b.transfers_out_event);
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
        <div className="table-container">
            <h2>Transfer Trends</h2>
            <input
                type="text"
                placeholder="Search by player name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th className={`sortable ${sortedColumn === 'name' ? 'active' : ''}`} onClick={() => handleColumnClick('name')}>Player Name</th>
                        <th className={`sortable ${sortedColumn === 'team' ? 'active' : ''}`} onClick={() => handleColumnClick('team')}>Team</th>
                        <th className={`sortable ${sortedColumn === 'in' ? 'active' : ''}`} onClick={() => handleColumnClick('in')}>Transfers In</th>
                        <th className={`sortable ${sortedColumn === 'out' ? 'active' : ''}`} onClick={() => handleColumnClick('out')}>Transfers Out</th>
                        <th className={`sortable ${sortedColumn === 'net' ? 'active' : ''}`} onClick={() => handleColumnClick('net')}>Net Transfers</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedPlayers.map(player => (
                        <tr key={player.id}>
                            <td>{player.first_name} {player.second_name}</td>
                            <td>{getTeamShortName(player.team)}</td>
                            <td>{player.transfers_in_event}</td>
                            <td>{player.transfers_out_event}</td>
                            <td>{player.transfers_in_event - player.transfers_out_event}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransferTrends;
