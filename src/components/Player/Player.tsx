import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ReactComponent as PlayIcon } from '../../assets/icons/pause-stream.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/play-stream.svg';
import { ReactComponent as RewindIcon } from '../../assets/icons/rewind-back.svg';
import { ReactComponent as VolumeMuteIcon } from '../../assets/icons/volume-cross.svg';
import { ReactComponent as VolumeIcon } from '../../assets/icons/volume-loud.svg';
import { Track } from 'components/Player/Player.types';

import styles from './Player.module.scss';

interface PlayerProps {
  playList: Track[];
}

export const Player: FC<PlayerProps> = ({ playList }) => {
  const audioPlayer = useRef() as React.MutableRefObject<HTMLAudioElement>;
  const volumeBar = useRef() as React.MutableRefObject<HTMLInputElement>;
  const progressBar = useRef() as React.MutableRefObject<HTMLInputElement>;
  const animationRef = useRef<number>();
  const DEFAULT_VOLUME = 45;

  const [currentTrack, setCurrentTrack] = useState<Track>(playList[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  const changeVolume = useCallback(() => {
    setVolume(parseInt(volumeBar.current.value));
  }, []);

  const handleVolumeMute = useCallback(() => {
    setVolume(0);
  }, []);

  const handleVolumeUp = useCallback(() => {
    if (volume === 0) {
      setVolume(DEFAULT_VOLUME);
    }

    if (volume < 95) {
      setVolume((prev) => prev + 5);
    }

    if (volume >= 95 && volume !== 100) {
      setVolume(100);
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const togglePrev = () => {
    playList.forEach((track, index) => {
      if (track.id === currentTrack.id) {
        if (playList[index - 1]) {
          setCurrentTrack(playList[index - 1]);
        } else {
          setCurrentTrack(playList[playList.length - 1]);
        }
      }
    });
  };

  const toggleNext = () => {
    playList.forEach((track, index) => {
      if (track.id === currentTrack.id) {
        if (playList[index + 1]) {
          setCurrentTrack(playList[index + 1]);
        } else {
          setCurrentTrack(playList[0]);
        }
      }
    });
  };

  const changeCurrentTime = useCallback(() => {
    progressBar.current.style.setProperty(
      '--before-width',
      `${(parseInt(progressBar.current.value) / duration) * 100}%`
    );
  }, [duration]);

  const handleCurrentTimeRange = () => {
    audioPlayer.current.currentTime = parseInt(progressBar.current.value);
    changeCurrentTime();
  };

  const animationPlaying = useCallback(() => {
    progressBar.current.value = audioPlayer.current.currentTime.toString();
    changeCurrentTime();
    animationRef.current = requestAnimationFrame(animationPlaying);
  }, [changeCurrentTime]);

  const onLoadedMetadata = () => {
    if (audioPlayer.current) {
      const seconds = Math.floor(audioPlayer.current.duration);
      setDuration(seconds);
      progressBar.current.max = seconds.toString();
    }

    audioPlayer.current.addEventListener('ended', toggleNext);
  };

  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.current.volume = volume / 100;
    }

    volumeBar.current.value = volume.toString();
    volumeBar.current.style.setProperty('--before-width', `${volume}%`);
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(animationPlaying);
    } else {
      audioPlayer.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isPlaying, animationPlaying]);

  return (
    <div>
      <audio
        src={currentTrack.src}
        className={styles.audio}
        ref={audioPlayer}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
      />

      <div className={styles.player}>
        <div className={styles.block}>
          <div className={styles.controls}>
            <button type="button" onClick={togglePrev} className={clsx(styles.button, styles.prev)}>
              <RewindIcon />
            </button>
            <button type="button" onClick={togglePlay} className={clsx(styles.button, styles.play)}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button type="button" onClick={toggleNext} className={clsx(styles.button, styles.next)}>
              <RewindIcon />
            </button>
          </div>
          <div className={styles.info}>
            <div className={styles.volControls}>
              <button type="button" className={styles.volumeControl} onClick={handleVolumeMute}>
                <VolumeMuteIcon />
              </button>
              <input
                type="range"
                className={styles.volumeBar}
                defaultValue={DEFAULT_VOLUME}
                min={0}
                max={100}
                ref={volumeBar}
                onChange={changeVolume}
              />
              <button type="button" className={styles.volumeControl} onClick={handleVolumeUp}>
                <VolumeIcon />
              </button>
            </div>
            <p className={styles.name}>
              {currentTrack.musician} - {currentTrack.name}
            </p>
            <div>
              <input
                type="range"
                className={clsx(styles.progressBar, !isPlaying && styles.progressBar_invisible)}
                defaultValue={0}
                ref={progressBar}
                onChange={handleCurrentTimeRange}
              />
            </div>
          </div>
        </div>
        <div className={styles.coverWrapper}>
          {currentTrack.cover && (
            <img
              src={currentTrack.cover}
              className={clsx(styles.cover, isPlaying && styles.cover_playing)}
              alt={currentTrack.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};
