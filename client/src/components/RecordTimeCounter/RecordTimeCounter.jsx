import React, { useState, useEffect } from 'react';

const RecordTimeCounter = ({ setIsRecording }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // stop recording after 60 seconds
    // dialogflow only accepts audio messages to an max of 60 seconds
    if (seconds === 60) {
      setIsRecording(false);
    }

    setTimeout(() => {
      if (isMounted) setSeconds(seconds + 1);
    }, 1000);
    return () => {
      isMounted = false;
    };
  }, [setIsRecording, setSeconds, seconds]);

  return <div>00:{seconds > 9 ? seconds : '0' + seconds}</div>;
};

export default RecordTimeCounter;
