import React, { useState } from 'react';

function SignupForm({ onSignup }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Still unused unless your backend uses it
    const [password, setPassword] = useState('');

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
                // ✅ Save to localStorage
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
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignupForm;
