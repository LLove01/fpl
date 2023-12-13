import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import premierLeagueLogo from '../assets/premier-league-logo.svg';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registered, setRegistered] = useState(false);
    const [managerId, setManagerId] = useState("");
    const [error, setError] = useState("");

    async function Register(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/register", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                managerId: managerId
            })
        });
        
        const response = await res.json();

        if (response.username !== undefined) {
            setRegistered(true);
        } else {
            setUsername("");
            setPassword("");
            setManagerId("");
            setError("Registration failed!");
        }
    }

    return (
        <div className="container w-25 h-50 justify-content-center text-color-secondary border border-2 border-secondary rounded p-4 background-second-items mt-5">
            <div className="jumbotron my-auto">
                <div className="text-center">
                    <img src={premierLeagueLogo} alt="asd" className="container w-50 center" />
                </div>
                <form className="mt-4" onSubmit={Register}>
                    {registered ? <Navigate replace to="/login" /> : ""}
                    <div className="form-outline mb-4">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" name="username" placeholder="Username" value={username} onChange={(e) => (setUsername(e.target.value))} />
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" placeholder="Password" value={password} onChange={(e) => (setPassword(e.target.value))} />
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label">Manager id</label>
                        <input type="text" className="form-control" name="managerId" placeholder="ManagerId" value={managerId} onChange={(e) => (setManagerId(e.target.value))} />
                    </div>
                    <input type="submit" name="submit" className="btn btn-outline-secondary w-100 mb-3 border-2 text-color-secondary" value="Register" />
                    <label>{error}</label>
                </form>
            </div>
        </div>
    );
}

export default Register;