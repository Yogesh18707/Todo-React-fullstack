import React, { useState } from 'react';
import AppRoutes from './route'; // or './AppRoutes' if that's the filename
import './styles.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    // const [view, setView] = useState(null);



    return (

        <AppRoutes token={token} setToken={setToken} hello={true} />

    );
}

export default App;
