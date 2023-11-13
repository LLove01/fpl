import React from 'react';
import NavigationMenu from './NavigationMenu';

const Header = () => {
    return (
        <header className="header">
            <h1>FPL Analytics Dashboard</h1>
            <NavigationMenu />
        </header>
    );
};

export default Header;
