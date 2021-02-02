import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import MediaStreamRecorder, { StereoAudioRecorder } from 'msr';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import InputIcon from '../InputIcon/InputIcon';
import RecordIndicator from '../RecordIndicator/RecordIndicator';
import RecordTimeCounter from '../RecordTimeCounter/RecordTimeCounter';

import './InputBar.css';

const InputBar = ({ message, setMessage, sendMessage, iconType, setIconType }) => {
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [deleteRecording, setDeleteRecording] = useState(false);
  const mediaConstraints = { audio: true };
  const iconStyle = {
    color: 'white',
    background: '#42a5f6',
    borderRadius: '7px',
    height: '30px',
    width: '30px',
  };

  let chatFormClass = 'chat-form';
  if (isRecording) chatFormClass += ' is-recording';
  else chatFormClass += ' is-not-recording';

  const stopRecording = useCallback(() => {
    if (recorder) recorder.stop(); // stops mediastreamrecorder

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop(); // stops capturing request (red dot in browser tab bar)
      });
      setLocalStream(null);
    }
  }, [localStream, recorder]);

  useEffect(() => {
    if (message.isAudioMessage && message.messageAudio && !deleteRecording) {
      sendMessage();
    }
  }, [message, sendMessage, deleteRecording]);

  useEffect(() => {
    if (!isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  useEffect(() => {
    if (deleteRecording) {
      setMessage({
        imageUrl: '',
        imageAlt: '',
        messageText: '',
        messageAudio: null,
        createdAt: '',
        isMyMessage: null,
        isAudioMessage: null,
        queryText: '',
      });
    }
  }, [setMessage, deleteRecording]);

  const onMediaSuccess = (stream) => {
    let audioRecorder = new MediaStreamRecorder(stream);
    audioRecorder.mimeType = 'audio/wav';
    audioRecorder.recorderType = StereoAudioRecorder;
    audioRecorder.audioChannels = 1;

    setLocalStream(stream);

    // * ondataavailable is triggered after the interval specified in the start function is over, or stop function is called
    audioRecorder.ondataavailable = (blob) => {
      setMessage({
        messageText: '...',
        createdAt: moment().format('HH:mm'),
        isMyMessage: true,
        isAudioMessage: true,
        messageAudio: blob,
      });
    };

    setRecorder(audioRecorder);
    // * max length in milliseconds of audio message
    // * dialogflow only takes audio input to a max length of 1 minute
    // * recording process gets killed by RecordTimeCounter.jsx after 60 seconds
    audioRecorder.start(60000);
  };

  const onMediaError = (e) => {
    console.error(e);
    setIsRecording(false);
    alert(e.message);
  };

  const handleChange = (event) => {
    setMessage({
      imageAlt: 'user',
      messageText: event.target.value,
      createdAt: moment().format('HH:mm'),
      aditoUserId: message.aditoUserId,
      isMyMessage: true,
      isAudioMessage: false,
      messageAudio: null,
      queryText: '',
    });

    event.target.value === '' ? setIconType('audio') : setIconType('text');
  };

  return (
    <form className={chatFormClass}>
      {isRecording ? (
        <div className="record-indicator-container">
          <div className="record-indicator">
            <RecordIndicator />
          </div>
          <div className="record-indicator-counter">
            <RecordTimeCounter setIsRecording={setIsRecording} />
          </div>
        </div>
      ) : (
        <input
          className="input"
          type="text"
          placeholder={!isRecording ? 'Schreibe eine Nachricht...' : ''}
          value={message.messageText || ''}
          onChange={handleChange}
          onKeyPress={(event) =>
            event.key === 'Enter' && message.messageText ? sendMessage(event) : null
          }
          disabled={isRecording}
        />
      )}
      {isRecording ? (
        <IconButton
          className="delete-recording-button"
          onClick={(event) => {
            event.preventDefault();
            setDeleteRecording(true);
            setIsRecording(false);
          }}
        >
          <DeleteIcon style={iconStyle} />
        </IconButton>
      ) : null}
      <IconButton
        className="input-button"
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          setDeleteRecording(false);
          switch (iconType) {
            case 'text':
              sendMessage(event);
              break;
            case 'audio':
              if (isRecording && recorder) {
                // * stop recording - triggers ondataavailable
                // * handling of recorder and localStream inside of useEffect (uses stopRecording())
                setIsRecording(false);
              } else if (!isRecording) {
                // * start recording
                setIsRecording(true);
                navigator.mediaDevices
                  .getUserMedia(mediaConstraints)
                  .then((stream) => {
                    onMediaSuccess(stream);
                  })
                  .catch((err) => {
                    onMediaError(err);
                  });
              }
              break;
            default:
              console.log('iconType: "' + iconType + '" not viable');
              break;
          }
        }}
      >
        <InputIcon iconType={iconType} isRecording={isRecording} />
      </IconButton>
    </form>
  );
};

export default InputBar;
