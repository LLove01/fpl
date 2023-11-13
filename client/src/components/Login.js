import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import premierLeagueLogo from '../assets/premier-league-logo.svg';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [logined, setLogined] = useState(false);
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 
 
    async function Login(event) {
        event.preventDefault();
        
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type' : "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const response = await res.json();  

        if (response.username !== undefined) {
            setLogined(true);
            userContext.setUserContext(response);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        <div className="container w-25 h-50 justify-content-center text-color-secondary border border-2 border-secondary rounded p-4 background-second-items mt-5">
            <div className="jumbotron my-auto">
                <div className="text-center">
                    <img src={premierLeagueLogo} alt="asd" className="container w-50 center" />
                </div>
                <form className="mt-4" onSubmit={Login}>
                    {logined ? <Navigate replace to="/" /> : ""}
                    <div className="form-outline mb-4">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" name="username" placeholder="Username" value={username} onChange={(e) => (setUsername(e.target.value))} />
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" placeholder="Password"
                            value={password} className="form-control" onChange={(e) => (setPassword(e.target.value))} />
                    </div>
                    <input type="submit" name="submit" className="btn btn-outline-secondary w-100 mb-3 border-2 text-color-secondary" value="Log in" />
                    
                    <label>{error}</label>

                    <div className="text-center mt-3">
                        <p>Not a member? <Link className="text-secondary" to='/register'>Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
