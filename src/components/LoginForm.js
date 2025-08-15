import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';


function LoginForm() {
    const [username, setUsername] = useState('');
    console.log(username)
    const [password, setPassword] = useState('');
    let navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            console.log('data',data)

            if (data.token) {
                localStorage.setItem("token", data.token);
                console.log('tests11111')

                if (localStorage.getItem('token')){
                    navigate("/todos");
                    // const x = () =>{
                    //     console.log('navigatekkkkk')
                    //     document.href="/todos"
                    //     // navigate("/todos")
                    // }
                    // x()
                }

                console.log('test333333333333333')

            } else {
                console.error(data.message || "Login failed");
            }
        } catch (err) {
           console.error("Server error");
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
