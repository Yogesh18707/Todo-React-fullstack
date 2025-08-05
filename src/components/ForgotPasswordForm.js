import React, { useState } from 'react';

function ForgotPasswordForm({ onBack }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        if (res.ok) {
            setMessage(data.message || 'Password reset link sent!');
        } else {
            setMessage(data.message || 'Error sending reset email.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Forgot Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <button type="submit">Send Reset Link</button>
            {message && <p>{message}</p>}
            <p style={{ textAlign: 'center' }}>
                <button type="button" onClick={onBack} className="login-btn">Back to Login</button>
            </p>
        </form>
    );
}

export default ForgotPasswordForm;
