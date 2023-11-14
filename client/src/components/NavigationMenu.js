import React from 'react';
import { UserContext } from "../userContext";
import { Link } from 'react-router-dom';

function NavigationMenu() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <nav>
            <ul className='navigation-menu'>
                <UserContext.Consumer>
                    {context => (
                        context.user ?
                            <>
                                <li><Link to="/">Player Analysis</Link></li>
                                <li><Link to="/team-insights">Team Insights</Link></li>
                                <li><Link to="/transfer-trends">Transfer Trends</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/optimize-team">Optimize Team</Link></li>
                                <li><Link to="/logout">Logout ({user.username})</Link></li>
                            </>
                            :
                            <>
                                <li><Link to="/">Player Analysis</Link></li>
                                <li><Link to="/team-insights">Team Insights</Link></li>
                                <li><Link to="/transfer-trends">Transfer Trends</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>

                    )}
                </UserContext.Consumer>
            </ul>
        </nav>
    );
}

export default NavigationMenu;
