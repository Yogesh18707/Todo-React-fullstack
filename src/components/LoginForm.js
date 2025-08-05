import React, { useState } from 'react';

function LoginForm({ onLogin, onForgotPassword }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok && data.token && data.user) {
            onLogin(data.token, data.user);
        } else {
            alert(data.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>
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
            <button type="submit">Login</button>
            <p style={{ textAlign: 'center' }}>
                <button type="button" onClick={onForgotPassword} className="forgot-btn">
                    Forgot Password?
                </button>
            </p>
        </form>
    );
}

export default LoginForm;
