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

            if (res.ok) {
                const data = await res.json();

                if (data.token) {
                    localStorage.setItem("token", data.token);

                    console.log('hello')

                    document.location.href = ("/todos");
                } else {
                    console.error("Token not found in response.");
                }
            } else {
                // Handle non-200 responses (e.g., 401 Unauthorized)
                const errorData = await res.json();
                console.error("Login failed:", errorData.message);
            }
        } catch (err) {
            console.error("Server error:", err);
        }
    };

    return (
        <div>
            <h1 style={{color:"white"}}>Welcome to the To-Do app</h1>
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
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
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
        </div>
    );
}

export default LoginForm;