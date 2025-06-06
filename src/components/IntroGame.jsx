import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bigButtonImage from '/assets/intro/big_button.png'; // Adjust path as needed

const IntroGame = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleStart = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/game');
        }, 2000);
    };

    const handleShort = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/view-cv');
        }, 2000);
    };

    const handleCredit = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/credits');
        }, 2000);
    };

    if (loading) {
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
    }

    return (
        <div style={styles.container}>
            <img
                src="/assets/map/map.png"
                alt="Map Background"
                style={styles.background}
            />

            <div style={styles.overlay} />

            <div style={styles.content}>
                <h1 style={styles.title}>Welcome to My Gamefolio</h1>
                <div style={styles.buttons}>
                    <button
                        onClick={handleStart}
                        style={styles.startButton}
                    >
                        {/* <span style={styles.buttonText}>Start</span> */}
                    </button>

                    <button
                        onClick={handleShort}
                        style={styles.Short}
                    >
                        <span style={styles.buttonText}>View CV</span>
                    </button>

                    <button
                        onClick={handleCredit}
                        style={styles.Short}
                    >
                        <span style={styles.buttonText}>Credits</span>
                    </button>

                    {/* <button>🌞 / 🌜</button>
                    <button>🎵</button> */}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 9999,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
        filter: 'brightness(40%)',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'white',
    },
    title: {
        fontSize: '48px',
        marginBottom: '20px',
        fontFamily: 'monospace',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    startButton: {
        background: `url(/assets/intro/big_button.png) no-repeat`,
        // Adjust these values based on your sprite sheet
        backgroundPosition: '0 -30px', // Change to show different parts of sprite
        width: '95px', // Set to the width of one sprite
        height: '30px', // Set to the height of one sprite
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        transform: 'scale(2)', // 1.5x size (adjust as needed)
        transformOrigin: 'center', // Ensures it scales from center
        margin: '20px 0', // Add margin to prevent overlapping with other buttons
    },

    Short: {
        background: `url(/assets/intro/big_button.png) no-repeat`,
        // Adjust these values based on your sprite sheet
        backgroundPosition: '0 0', // Change to show different parts of sprite
        width: '95px', // Set to the width of one sprite
        height: '30px', // Set to the height of one sprite
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        transform: 'scale(2)', // 1.5x size (adjust as needed)
        transformOrigin: 'center', // Ensures it scales from center
        margin: '20px 0', // Add margin to prevent overlapping with other buttons
    },
    buttonText: {
        position: 'relative',
        zIndex: 2,
        color: '#b68962', // Your specified color
        fontFamily: 'monospace',
        fontSize: '16px',
        // Optional additional styling:
        textShadow: '0 1px 2px rgba(0,0,0,0.3)', // Adds subtle depth
        transition: 'color 0.3s ease' // Smooth color transitions
    },
    loadingScreen: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '32px',
        fontFamily: 'monospace',
    },
    loadingText: {
        animation: 'blink 1s infinite',
    },
};

export default IntroGame;