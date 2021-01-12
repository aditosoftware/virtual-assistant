import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Chat from './components/Chat/Chat';
import StartupIndicator from './components/StartupIndicator/StartupIndicator';

function useAsync(url) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getResource() {
      try {
        setLoading(true);
        const result = await axios(url);
        setValue(result.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    getResource();
  }, [url]);

  return { value, setValue, error, loading };
}

const App = () => {
  // extract url params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const aditoUserId = urlParams.get('user');
  const ttsEnabled = urlParams.get('ttsEnabled') === 'true'; // make sure to convert string to boolean
  const tutorialEnabled = urlParams.get('tutorialEnabled') === 'true'; // make sure to convert string to boolean

  // in start.sh localhost:5000 gets replaced with node server address
  const message = useAsync('http://localhost:5000/api/message');
  const image = useAsync('http://localhost:5000/api/picture?id=' + aditoUserId);

  if (message.error) return `Failed to load message model from server: ${message.error}`;
  if (image.error) return `Failed to load user image from server: ${image.error}`;

  return message.loading || image.loading ? (
    <StartupIndicator />
  ) : (
    <Chat
      aditoUserId={aditoUserId}
      aditoUserImage={image.value}
      message={message.value}
      setMessage={message.setValue}
      ttsEnabled={ttsEnabled}
      tutorialEnabled={tutorialEnabled}
    />
  );
};

export default App;
