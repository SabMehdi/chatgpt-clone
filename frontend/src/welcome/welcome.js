import React from 'react';
import './Welcome.css'; 

function Welcome() {
    return (
        <div className="welcome-container">
            <div className="card welcome-card shadow-lg">
                <div className="card-body">
                    <h3 className="card-title text-primary">Welcome !</h3>
                    <p className="card-text">Connect with me:</p>
                    <a href="https://github.com/SabMehdi/keiken" target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm m-1">GitHub</a>
                    <a href="https://www.linkedin.com/in/saber-al-mehdi/" target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm m-1">LinkedIn</a>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
