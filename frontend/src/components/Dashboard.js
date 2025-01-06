import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserCircle, faHistory } from '@fortawesome/free-solid-svg-icons';
import '../styles/Dashboard.css';



const Dashboard = ({ userData }) => {
    const navigate = useNavigate();
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchImage, setSearchImage] = useState(null);
    const [showOutputBox, setShowOutputBox] = useState(false);
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchText || !searchImage) {
            setOutput('Please provide a search input as per requirements');
            // setShowOutputBox(true);
            return;
        }

        const newHistory = {
            type: searchImage ? 'Image' : 'Text',
            query: searchImage ? searchImage.name : searchText,
        };
        setSearchHistory([newHistory, ...searchHistory]);

        setLoading(true);

        try {
            const formData = new FormData();
            if (searchImage) formData.append('image', searchImage);
            if (searchText) formData.append('text', searchText);

            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                setOutput(data.result);
            } else {
                setOutput(`Error: ${data.error}`);
            }
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setLoading(false);
            setShowOutputBox(true);
            setSearchText('');
            setSearchImage(null);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const closeOutputBox = () => {
        setShowOutputBox(false);
    };

    return (
        <div className="dashboard">
            <header className="navbar">
                <div className="nav-left">
                    <div
                        className="nav-icon"
                        onClick={() => setShowSearchHistory(!showSearchHistory)}
                    >
                        <FontAwesomeIcon icon={faHistory} /> Search History
                    </div>
                </div>
                <div className="nav-right">
                    <div
                        className="nav-icon"
                        onClick={() => setShowAccountDetails(!showAccountDetails)}
                    >
                        <FontAwesomeIcon icon={faUserCircle} /> Account
                    </div>
                </div>
            </header>


            <main className="main-content">
                <div className="card-container">
                    {/* Left Card */}
                    <div className="card search-card">
                        <h2>Search</h2>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-file"
                            onChange={(e) => setSearchImage(e.target.files[0])}
                        />
                        {searchImage && (
                            <div className="image-preview">
                            <img
                                src={URL.createObjectURL(searchImage)}
                                alt="Uploaded"
                                className="uploaded-image"
                            />
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Enter search text"
                            className="input-text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch} disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Right Card */}
                    <div className="card output-card">
                        <h2>Output</h2>
                        {showOutputBox ? (
                            <div className="output-box-content">
                                <button className="close-button" onClick={closeOutputBox}>
                                    &times;
                                </button>
                                <p>{output}</p>
                            </div>
                        ) : (
                            <p>No output to display yet.</p>
                        )}
                    </div>
                </div>
            </main>


            {/* {showOutputBox && (
                <div className="output-box">
                    <div className="output-box-content">
                        <button className="close-button" onClick={closeOutputBox}>
                            &times;
                        </button>
                        <h2>Search Output</h2>
                        <p>{output}</p>
                    </div>
                </div>
            )} */}

            {showAccountDetails && (
                <div className="account-details">
                    <h2>Account Details</h2>
                    {userData ? (
                    <>
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                    </>
                    ) : (
                    <p><strong>Account details not available. Please log in.</strong></p>
                    )}
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}

            {showSearchHistory && (
                <div className="search-history">
                    <h2>Search History</h2>
                    <ul>
                        {searchHistory.map((item, index) => (
                            <li key={index} className="history-item">
                                <strong>{item.type}:</strong> {item.query}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
