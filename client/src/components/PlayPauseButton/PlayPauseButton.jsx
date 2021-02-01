import React, { useState, useEffect, useCallback, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import { toArrayBuffer } from '../../utils';

const PlayPauseButton = ({ message, isPlaying, setIsPlaying }) => {
  const [ac, setAudioContext] = useState(null);
  const sourceNode = useRef(null);

  const createSound = useCallback(
    (buffer, context) => {
      let startedAt = 0,
        pausedAt = 0,
        playing = false;

      const play = function () {
        var offset = pausedAt;

        sourceNode.current = context.createBufferSource();
        sourceNode.current.connect(context.destination);
        sourceNode.current.onended = () => {
          message.isPlaying = false;
          setIsPlaying(false);
          playing = false;
        };
        sourceNode.current.buffer = buffer;
        sourceNode.current.start(0, offset);

        startedAt = context.currentTime - offset;
        pausedAt = 0;
        playing = true;
        message.isPlaying = true;
        setIsPlaying(true);
      };

      const pause = function () {
        var elapsed = context.currentTime - startedAt;
        stop();
        pausedAt = elapsed;
      };

      const stop = function () {
        if (sourceNode.current) {
          sourceNode.current.disconnect();
          sourceNode.current.stop(0);
          sourceNode.current = null;
        }
        pausedAt = 0;
        startedAt = 0;
        playing = false;
        message.isPlaying = false;
        setIsPlaying(false);
      };

      const getPlaying = function () {
        return playing;
      };

      const getCurrentTime = function () {
        if (pausedAt) {
          return pausedAt;
        }
        if (startedAt) {
          return context.currentTime - startedAt;
        }
        return 0;
      };

      const getDuration = function () {
        return buffer.duration;
      };

      return {
        getCurrentTime: getCurrentTime,
        getDuration: getDuration,
        getPlaying: getPlaying,
        play: play,
        pause: pause,
        stop: stop,
      };
    },
    [message.isPlaying, setIsPlaying]
  );

  const handleClick = async (e) => {
    e.preventDefault();

    let buffer = await ac.decodeAudioData(toArrayBuffer(message.messageAudio.data));
    let sound = createSound(buffer, ac);

    if (message.isPlaying) {
      // curr msg is playing -> pause clicked msg
      sound.pause();
    } else if (!message.isPlaying && isPlaying) {
      // curr msg is not playing but some other msg is playing -> do nothing
      return null;
      // TODO: stop curr playing msg and play the clicked one
    } else {
      // curr msg and no other msg is curr playing -> play clicked msg
      sound.play();
    }
  };

  useEffect(() => {
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    async function handleTTS() {
      if (message.ttsEnabled && ac) {
        let buffer = await ac.decodeAudioData(toArrayBuffer(message.messageAudio.data));
        let sound = createSound(buffer, ac);
        message.ttsEnabled = false;
        sound.play();
      }
    }

    handleTTS();
  }, [ac, message.messageAudio.data, message.ttsEnabled, createSound]);

  return (
    <IconButton onClick={handleClick} color="inherit">
      {message.isPlaying ? <PauseIcon /> : <PlayIcon />}
    </IconButton>
  );
};

export default PlayPauseButton;
