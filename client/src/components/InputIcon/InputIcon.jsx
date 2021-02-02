import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

const iconStyle = {
  color: 'white',
  background: '#42a5f6',
  borderRadius: '7px',
  height: '30px',
  width: '30px',
};

const InputIcon = ({ iconType, isRecording }) => {
  if (iconType === 'text' || isRecording) {
    return <SendIcon style={iconStyle} />;
  } else {
    return <MicIcon style={iconStyle} />;
  }
};

export default InputIcon;
