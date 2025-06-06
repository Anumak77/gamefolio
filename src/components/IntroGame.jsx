import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroGame = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleStart = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/game');
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
                src="/assets/map/intro.png"
                alt="Map Background"
                style={styles.background}
            />

            <div style={styles.overlay} />

            <div style={styles.content}>
                <h1 style={styles.title}>Welcome to My World</h1>
                <div style={styles.buttons}>
                    <button onClick={handleStart}>Start</button>
                    <button>Short Version</button>
                    <button>Settings</button>
                    <button>Credits</button>
                    <button>🌞 / 🌜</button>
                    <button>🎵</button>
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
