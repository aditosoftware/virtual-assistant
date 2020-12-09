import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

const InputIcon = ({ iconType, isRecording }) => {
  if (iconType === 'text' || isRecording) {
    return <SendIcon />;
  } else {
    return <MicIcon />;
  }
};

export default InputIcon;
