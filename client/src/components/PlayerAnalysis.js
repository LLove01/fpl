import React, { useState, useEffect } from 'react';
import { fetchGeneralInfo } from '../services/apiService';
import Chart from 'chart.js/auto'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const PlayerAnalysis = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);

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

    const handlePlayerSelect = (player) => {
        const updatedSelectedPlayers = [...selectedPlayers];

        if (updatedSelectedPlayers.length === 2) {
            updatedSelectedPlayers.shift();
        }
        updatedSelectedPlayers.push(player);

        if (selectedPlayers.length !== 0) {
            const canvas = document.getElementById('acquisitions');
            const existingChart = Chart.getChart(canvas);
            if (existingChart) {
                existingChart.destroy(); // Destroy the previous chart
            }
        }

        setSelectedPlayers(updatedSelectedPlayers);

        if (updatedSelectedPlayers.length === 1 || updatedSelectedPlayers[0] === updatedSelectedPlayers[1]) {
            const data = {
                labels: [
                    'Cost',
                    'Creativity',
                    'Bonus points',
                    'Threat',
                    'Influence',
                    'Total points',
                    'Goals scored'
                ],
                datasets: [{
                    label: updatedSelectedPlayers[0].first_name + " " + updatedSelectedPlayers[0].second_name,
                    data: [updatedSelectedPlayers[0].now_cost, parseInt(updatedSelectedPlayers[0].creativity), updatedSelectedPlayers[0].bps, parseInt(updatedSelectedPlayers[0].threat), parseInt(updatedSelectedPlayers[0].influence), updatedSelectedPlayers[0].total_points, updatedSelectedPlayers[0].goals_scored],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            };

            const chartCanvas = document.getElementById('acquisitions');

            if (chartCanvas) {
                const ctx = chartCanvas.getContext('2d');
                new Chart(ctx, {
                    type: 'radar',
                    data: data,
                    options: {
                        elements: {
                            line: {
                                borderWidth: 3
                            }
                        }
                    }
                });
            } else {
                console.error("Canvas element 'acquisitions' not found");
            }
        } else if (updatedSelectedPlayers.length === 2) {
            const data = {
                labels: [
                    'Cost',
                    'Creativity',
                    'Bonus points',
                    'Threat',
                    'Influence',
                    'Total points',
                    'Goals scored'
                ],
                datasets: [{
                    label: updatedSelectedPlayers[0].first_name + " " + updatedSelectedPlayers[0].second_name,
                    data: [updatedSelectedPlayers[0].now_cost, parseInt(updatedSelectedPlayers[0].creativity), updatedSelectedPlayers[0].bps, parseInt(updatedSelectedPlayers[0].threat), parseInt(updatedSelectedPlayers[0].influence), updatedSelectedPlayers[0].total_points, updatedSelectedPlayers[0].goals_scored],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }, {
                    label: updatedSelectedPlayers[1].first_name + " " + updatedSelectedPlayers[1].second_name,
                    data: [updatedSelectedPlayers[1].now_cost, parseInt(updatedSelectedPlayers[1].creativity), updatedSelectedPlayers[1].bps, parseInt(updatedSelectedPlayers[1].threat), parseInt(updatedSelectedPlayers[1].influence), updatedSelectedPlayers[1].total_points, updatedSelectedPlayers[1].goals_scored],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            };

            const chartCanvas = document.getElementById('acquisitions');

            if (chartCanvas) {
                const ctx = chartCanvas.getContext('2d');
                new Chart(ctx, {
                    type: 'radar',
                    data: data,
                    options: {
                        elements: {
                            line: {
                                borderWidth: 3
                            }
                        }
                    }
                });
            } else {
                console.error("Canvas element 'acquisitions' not found");
            }
        }
    };

    const centerDivStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div className="p-3">
            <h2>Player Analysis</h2>
            <input
                type="text"
                placeholder="Search player..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Container>
                <Row>
                    <Col >
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th className={`sortable ${sortedColumn === 'name' ? 'active' : ''}`} onClick={() => handleColumnClick('name')}>Player Name</th>
                                        <th className={`sortable ${sortedColumn === 'team' ? 'active' : ''}`} onClick={() => handleColumnClick('team')}>Team</th>
                                        <th className={`sortable ${sortedColumn === 'points' ? 'active' : ''}`} onClick={() => handleColumnClick('points')}>Points</th>
                                        <th className={`sortable ${sortedColumn === 'price' ? 'active' : ''}`} onClick={() => handleColumnClick('price')}>Price (£)</th>
                                        <th className={`sortable ${sortedColumn === 'ppm' ? 'active' : ''}`} onClick={() => handleColumnClick('ppm')}>Points per Million</th>
                                        <th className={`sortable ${sortedColumn === 'ict' ? 'active' : ''}`} onClick={() => handleColumnClick('ict')}>ICT Index</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedPlayers.map(player => (
                                        <tr key={player.id} onClick={() => handlePlayerSelect(player)}>
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
                    </Col>
                    <Col>
                        <div className="selected-player">
                            <div style={{ width: '600px', maxHeight: '450px' }}><canvas id="acquisitions"></canvas></div>
                        </div>
                    </Col>
                </Row>
            </Container>

        </div>
    );
};

export default PlayerAnalysis;
