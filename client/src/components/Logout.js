import React from 'react';
import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../userContext';

function Logout() {
    const userContext = useContext(UserContext); 
    useEffect(function(){
        const logout = async function() {
            userContext.setUserContext(null);
            const res = await fetch("http://localhost:3001/users/logout");
        }
        logout();
    }, []);

    return (
        <Navigate replace to="/" />
    );
}

export default Logout;
