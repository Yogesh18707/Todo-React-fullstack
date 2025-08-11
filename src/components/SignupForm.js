import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupForm({ onSignup }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, password })
            });

            const data = await res.json();

            if (res.ok && data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);

                alert("Signup successful!");
                onSignup(data.token, data.user);
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Sign Up</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />

            <div className="button-group">
                <button type="submit" className="signup-btn">Sign Up</button>
                <button
                    type="button"
                    className="login-btn"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
            </div>
        </form>
    );
}

export default SignupForm;
