import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

import MessageList from '../MessageList/MessageList';
import InputBar from '../InputBar/InputBar';

import { playOutput, toArrayBuffer, blobToFile } from '../../utils';

import './Chat.css';

const Chat = ({ aditoUserId, aditoUserImage, message, setMessage, ttsEnabled }) => {
  const [messages, setMessages] = useState([]);
  const [iconType, setIconType] = useState('audio');
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // used to force update in useEffect to refresh to display audio message as text

  useEffect(() => {
    let lastBotMsg = messages[messages.length - 1];

    if (lastBotMsg && lastBotMsg.queryText) {
      let lastUserMsg = messages[messages.length - 2];
      if (lastUserMsg) {
        lastUserMsg.messageText = lastBotMsg.queryText;
        forceUpdate();
      }
    }
  }, [messages]);

  const sendMessage = async (event) => {
    if (event) event.preventDefault();

    // prepare message object
    let messageInstance = message;
    messageInstance.imageUrl = `data:image/png;base64,${aditoUserImage.image}`;
    messageInstance.imageAlt = 'user';
    messageInstance.aditoUserId = aditoUserId;
    setMessage(messageInstance);

    // audio message
    // adding audio message in form of placeholder text to messages
    setMessages((messages) => [...messages, message]);

    let fd = new FormData();
    fd.append('message', JSON.stringify(message));
    fd.append('audio', blobToFile(message.messageAudio, 'audio.wav'));

    axios
      .post('http://localhost:5000/api/message', fd)
      .then((res) => {
        // adding dialogflow response (already in chat message format) to messages
        setMessages((messages) => [...messages, res.data]);
        if (ttsEnabled) playOutput(toArrayBuffer(res.data.messageAudio.data));
      })
      .catch((err) => {
        console.log(err);
      });

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
    });

    setIconType('audio');
  };

  return (
    <div className="chat-container">
      <MessageList messages={messages} />
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
