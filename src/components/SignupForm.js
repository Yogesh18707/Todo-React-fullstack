import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('https://todo-backend-ki9o.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }) // ✅ only username + password
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signup successful! Please login.");
                navigate('/login'); // ✅ redirect to login
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server.");
        }
    };

    return (
        <div>
            <h1 style={{color:"white"}}>SignUp to Login now!</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Sign Up</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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
                </div>
            </form>
        </div>
    );
}

export default SignupForm;
