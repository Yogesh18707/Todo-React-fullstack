import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
const API_BASE = process.env.REACT_APP_BACKEND_URL;

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // clear old errors

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("✅ Login successful!");
        document.location.href=("/todos")
      } else {
        setError(data.message || "Invalid credentials ❌");
      }
    } catch (err) {
      console.error("Server error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div>
      <h1 style={{ color: "white" }}>Welcome to the To-Do app</h1>
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      width: "100%",           // username input ke size ke barabar
      height: "45px",          // fixed height same as username
      paddingRight: "40px",    // eye icon ke liye space
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
          <button type="submit" className="login-btn">
            Login
          </button>
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
