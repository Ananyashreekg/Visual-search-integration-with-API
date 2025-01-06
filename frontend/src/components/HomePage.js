import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';


const HomePage = () => {
    return (
        <div className="home-page">
            <header>
                <h1>Welcome to Visual Search Enhancements</h1>
                <Link to="/login" className="login-button">Login</Link>
            </header>
            <main>
               
            </main>
        </div>
    );
};

export default HomePage;
