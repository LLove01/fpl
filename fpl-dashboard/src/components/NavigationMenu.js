import React from 'react';
import { Link } from 'react-router-dom';

function NavigationMenu() {
    return (
        <nav>
            <ul className='navigation-menu'>
                <li><Link to="/">Player Analysis</Link></li>
                <li><Link to="/team-insights">Team Insights</Link></li>
                <li><Link to="/transfer-trends">Transfer Trends</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
}

export default NavigationMenu;
