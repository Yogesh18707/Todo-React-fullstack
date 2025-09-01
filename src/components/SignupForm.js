import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";

const API_BASE = process.env.REACT_APP_BACKEND_URL;


function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signup successful! Please login.");
                // ✅ redirect to login page after successful signup
                navigate('/login');
                document.location.href="/login";
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (err) {
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
               
        <div style={{ position: "relative", width: "100%" }}>
  <input
    required
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    autoComplete="off"
    style={{
      width: "100%",      
      height: "45px",          
      paddingRight: "40px",   
      paddingLeft: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#e5eaf0",
      boxSizing: "border-box",
    }}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "10px",
      top: "40%",                     
      transform: "translateY(-50%)",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      outline: "none",    
    boxShadow: "none", 
    }}
  >
    {showPassword ? (
      <EyeOff size={20} color="black" />
    ) : (
      <Eye size={20} color="black" />
    )}
  </button>
</div>

                <div className="button-group">
                    <button type="submit" className="signup-btn">Sign Up</button>

                </div>
            </form>
        </div>
    );
}

export default SignupForm;
