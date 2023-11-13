import React from 'react';
import premierLeagueLogo from '../assets/premier-league-logo.svg';

const About = () => {
    return (
        <div className="about-container">
            <h2>About FPL Analytics Dashboard</h2>

            <div className="about-content">
                <p>
                    The Fantasy Premier League (FPL) is the official fantasy football game of the English Premier League.
                    It allows users to become virtual managers of a football team, selecting real-life players from the
                    Premier League and scoring points based on their performances.
                </p>

                <p>
                    The FPL Analytics Dashboard provides comprehensive insights and analytics for FPL managers, helping
                    them make informed decisions and optimize their teams. From player statistics to team insights and
                    transfer trends, the dashboard offers a range of tools to enhance the FPL experience.
                </p>

                <img src={premierLeagueLogo} alt="Premier League Logo" className="pl-logo" />
            </div>
        </div>
    );
}

export default About;
