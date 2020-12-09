import React from 'react';

import { playOutput, toArrayBuffer } from '../../utils';

import './Message.css';

const Message = (props) => {
  let messageClass = 'message-row';
  let imageThumbnail = null;
  let displayMessageContent = null;

  if (props.message.isMyMessage) {
    messageClass += ' own-message';
  } else {
    messageClass += ' other-message';
  }

  imageThumbnail = <img src={props.message.imageUrl} alt={props.message.imageAlt} />;

  // changing icon position depending on message type
  if (props.message.isMyMessage) {
    displayMessageContent = (
      <div className="message-content">
        <div className="message-text">{props.message.messageText}</div>
        {imageThumbnail}
        <div className="message-time">{props.message.createdAt}</div>
      </div>
    );
  } else {
    displayMessageContent = (
      <div className="message-content" onClick={handleClick}>
        {imageThumbnail}
        <div className="message-text">{props.message.messageText}</div>
        <div className="message-time">{props.message.createdAt}</div>
      </div>
    );
  }

  function handleClick(e) {
    e.preventDefault();
    playOutput(toArrayBuffer(props.message.messageAudio.data));
  }

  return <div className={messageClass}>{displayMessageContent}</div>;
};

export default Message;
