import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';

const iconStyle = { color: "white", background: "#42a5f6", borderRadius: "7px", height: "30px", width: "30px" };

const InputIcon = ({ iconType, isRecording }) => {
  if (iconType === 'text') {
    return <SendIcon style={iconStyle} />;
  } else if (isRecording) {
    return <StopIcon style={iconStyle} />;
  } else {
    return <MicIcon style={iconStyle} />;
  }
};

export default InputIcon;
