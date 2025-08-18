import React, { useState } from 'react';
import AppRoutes from './route';
import './styles.css';


function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <AppRoutes token={token} setToken={setToken} hello={true} />
    );
}

export default App;