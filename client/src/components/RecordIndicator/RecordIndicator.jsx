import React from 'react';
import Icon from '@material-ui/core/Icon';
import RecordIcon from '@material-ui/icons/FiberManualRecord';

const iconStyle = { color: "red", height: "20px", width: "20px" };

const RecordIndicator = () => {
    return <Icon className="record-icon"><RecordIcon style={iconStyle} /></Icon>;
};

export default RecordIndicator;
