import React from 'react';

import Message from '../Message/Message';

import './MessageList.css';

const MessageList = ({ messages }) => {
  const messageItems = messages
    .slice(0)
    .reverse()
    .map((message, index) => {
      return <Message key={index} message={message} />;
    });

  return <div className="chat-message-list">{messageItems}</div>;
};

export default MessageList;
