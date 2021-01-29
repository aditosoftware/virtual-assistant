import React from 'react';

import PlayPauseButton from '../PlayPauseButton/PlayPauseButton';

import './Message.css';

const Message = ({ message, ttsEnabled, isPlaying, setIsPlaying }) => {
  let messageClass = 'message-row';
  let imageThumbnail = null;
  let displayMessageContent = null;

  message.isMyMessage ? (messageClass += ' own-message') : (messageClass += ' other-message');

  imageThumbnail = <img src={message.imageUrl} alt={message.imageAlt} />;

  // changing icon position depending on message type
  if (message.isMyMessage) {
    displayMessageContent = (
      <div className="message-content">
        <div className="message-text">{message.messageText}</div>
        {imageThumbnail}
        <div className="message-time">{message.createdAt}</div>
      </div>
    );
  } else {
    displayMessageContent = (
      <div className="message-content">
        {imageThumbnail}
        <div className="message-text">
          <PlayPauseButton
            message={message}
            ttsEnabled={ttsEnabled}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
          {message.messageText}
        </div>
        <div className="message-time">{message.createdAt}</div>
      </div>
    );
  }

  return <div className={messageClass}>{displayMessageContent}</div>;
};

export default Message;
