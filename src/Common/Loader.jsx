import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <div className="loading-text">Chozha Boys Hostel</div>
            <div className="loading-subtext">Loading Application...</div>
        </div>
    );
};

export default Loader;
