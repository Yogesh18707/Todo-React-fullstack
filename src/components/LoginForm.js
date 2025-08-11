import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                navigate("/todos");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            alert("Server error");
        }
    };

    return (
        <form onSubmit={handleLogin} className="login-form">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <div className="button-group">
                <button type="submit" className="login-btn">Login</button>
                <button
                    type="button"
                    className="signup-btn"
                    onClick={() => navigate("/signup")}
                >
                    Sign Up
                </button>
            </div>
        </form>
    );
}

export default LoginForm;
