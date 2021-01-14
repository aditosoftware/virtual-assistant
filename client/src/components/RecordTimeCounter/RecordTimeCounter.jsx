import React, { useState, useEffect } from 'react';

const RecordTimeCounter = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setTimeout(() => setSeconds(seconds + 1), 1000);
  }, [setSeconds, seconds]);

  return <div>00:{seconds > 9 ? seconds : "0" + seconds}</div>;
}

export default RecordTimeCounter;