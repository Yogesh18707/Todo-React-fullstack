import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import TodoPage from './TodoPage'; // ✅ correct (match your actual filename)

function AppRoutes({ token, setToken }) {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route
                path="/signup"
                element={
                    <SignupForm
                        onSignup={() => {
                            alert('Signup successful, please login.');
                            navigate('/login');
                        }}
                    />
                }
            />

            <Route
                path="/login"
                element={
                    <LoginForm
                        onLogin={(newToken) => {
                            alert('Login successful ✅');
                            localStorage.setItem('token', newToken);
                            setToken(newToken);
                            navigate('/todos'); // match the actual route path
                        }}
                    />
                }
            />

            <Route
                path="/todos"
                element={
                    token ? (
                        <TodoPage token={token} setToken={setToken} hello={1} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
}

export default AppRoutes;
