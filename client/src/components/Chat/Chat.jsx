import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';

import MessageList from '../MessageList/MessageList';
import InputBar from '../InputBar/InputBar';

import { playOutput, toArrayBuffer, blobToFile } from '../../utils';

import './Chat.css';

const Chat = ({
  aditoUserId,
  aditoUserImage,
  message,
  setMessage,
  ttsEnabled,
  tutorialEnabled,
  usertoken,
}) => {
  const [messages, setMessages] = useState([]);
  const [iconType, setIconType] = useState('audio');
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // used to force update in useEffect to refresh to display audio message as text
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let lastBotMsg = messages[messages.length - 1];

    if (lastBotMsg && lastBotMsg.queryText) {
      let lastUserMsg = messages[messages.length - 2];
      if (lastUserMsg) {
        lastBotMsg.queryText === 'ADITO_FALLBACK'
          ? (lastUserMsg.messageText = '...')
          : (lastUserMsg.messageText = lastBotMsg.queryText);
        forceUpdate();
      }
    }
  }, [messages]);

  useEffect(() => {
    // runs only if tutorialEnabled or aditoUserId changes (basically once on startup)
    if (tutorialEnabled) {
      // trigger dialogflow custom event ADITO_TUTORIAL through GET /tutorial
      trackPromise(
        axios({
          method: 'post',
          url: 'http://localhost:5000/api/tutorial',
          data: { aditoUserId: aditoUserId, event: 'ADITO_TUTORIAL' },
        }).then((res) => {
          // add response to messages
          setMessages((messages) => [...messages, res.data]);
        })
      );
    }
  }, [tutorialEnabled, aditoUserId]);

  const sendMessage = async (event) => {
    if (event) event.preventDefault();

    // prepare message object
    let messageInstance = message;
    messageInstance.imageUrl = `data:image/png;base64,${aditoUserImage.image}`;
    messageInstance.imageAlt = 'user';
    messageInstance.aditoUserId = aditoUserId;
    messageInstance.usertoken = usertoken;
    messageInstance.isPlaying = false;
    setMessage(messageInstance);

    // audio message
    // adding audio message in form of placeholder text to messages
    setMessages((messages) => [...messages, message]);

    let fd = new FormData();
    fd.append('message', JSON.stringify(message));
    fd.append('audio', blobToFile(message.messageAudio, 'audio.wav'));

    trackPromise(
      axios
        .post('http://localhost:5000/api/message', fd) // in start.sh localhost:5000 gets replaced with node server address
        .then((res) => {
          // adding dialogflow response (already in chat message format) to messages
          setMessages((messages) => [...messages, res.data]);
          // TODO: move auto tts to PlayPauseButton.jsx
          if (ttsEnabled) playOutput(toArrayBuffer(res.data.messageAudio.data));
        })
        .catch((err) => {
          console.log(err);
        })
    );

    // this setMessage is necessary to clear inputbar
    setMessage({
      imageUrl: '',
      imageAlt: 'user',
      messageText: '',
      messageAudio: null,
      createdAt: '',
      aditoUserId: aditoUserId,
      isMyMessage: null,
      isAudioMessage: null,
      queryText: '',
      usertoken: usertoken,
    });

    setIconType('audio');
  };

  return (
    <div className="chat-container">
      <MessageList
        messages={messages}
        ttsEnabled={ttsEnabled}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      <InputBar
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        iconType={iconType}
        setIconType={setIconType}
      />
    </div>
  );
};

export default Chat;
