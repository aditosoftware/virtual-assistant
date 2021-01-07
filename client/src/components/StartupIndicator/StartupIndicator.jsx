import React from 'react';
import Loader from 'react-loader-spinner'

import './StartupIndicator.css';

const StartupIndicator = (props) => {
    return (
        <div className="startup-indicator-content">
            <div className="startup-indicator-loader"><Loader type="Oval" color="#777" height="50" width="50" /></div>
            <div className="startup-indicator-message">Loading message model and user image</div>
        </div>
    );
};

export default StartupIndicator;
