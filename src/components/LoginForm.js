import { useNavigate } from 'react-router-dom';

function LoginForm() {
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
                alert("Login successful");
                navigate("/dashboard");  // 👈 change path to your target page
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            alert("Server error");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {/* your login form here */}
        </form>
    );
}
