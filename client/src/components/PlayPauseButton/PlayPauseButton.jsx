import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import { toArrayBuffer } from '../../utils';

const iconStyle = { color: 'black', background: 'transparent' };

const PlayPauseButton = ({ message, ttsEnabled, isPlaying, setIsPlaying }) => {
  const [ac, setAudioContext] = useState(null);
  let [sourceNode, setSourceNode] = useState(null);

  useEffect(() => {
    setAudioContext(new AudioContext());
  }, []);

  function createSound(buffer, context) {
    let startedAt = 0,
      pausedAt = 0,
      playing = false;

    const play = function () {
      var offset = pausedAt;

      sourceNode = context.createBufferSource();
      setSourceNode(sourceNode);
      sourceNode.connect(context.destination);
      sourceNode.onended = () => {
        message.isPlaying = false;
        setIsPlaying(false);
        playing = false;
      };
      sourceNode.buffer = buffer;
      sourceNode.start(0, offset);

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
      if (sourceNode) {
        sourceNode.disconnect();
        sourceNode.stop(0);
        sourceNode = null;
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
  }

  const handleClick = async (e) => {
    e.preventDefault();

    let buffer = await ac.decodeAudioData(toArrayBuffer(message.messageAudio.data));
    let sound = createSound(buffer, ac);

    message.isPlaying ? sound.pause() : sound.play();
  };

  return (
    <IconButton onClick={handleClick}>
      {message.isPlaying ? <PauseIcon iconstyle={iconStyle} /> : <PlayIcon iconstyle={iconStyle} />}
    </IconButton>
  );
};

export default PlayPauseButton;
