import React from 'react';
import Loader from 'react-loader-spinner'
import { usePromiseTracker } from 'react-promise-tracker';

import './WritingIndicator.css';

const WritingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker();

    return (
      promiseInProgress &&
        <div className="writing-indicator-content">
            <div className="writing-indicator-message">schreibt</div>
            <div className="writing-indicator-loader"><Loader type="ThreeDots" color="#777" height="22" width="22"/></div>
        </div>
    );
};

export default WritingIndicator;
