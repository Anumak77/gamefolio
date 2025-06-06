import React from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
    return (
        <div className="loading-container">
            <img
                src="/assets/loading/fallingleafanim.gif"
                alt="Loading...STOP"
                className="loading-gif"
            />
            <p className="loading-text">Wandering through the woods...</p>
        </div>
    );
};

export default LoadingPage;
