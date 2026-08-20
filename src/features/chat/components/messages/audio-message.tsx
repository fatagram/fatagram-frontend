import { useRef, useState } from "react";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

interface AudioMessageProps extends ComponentProps {
  url: string;
  isMyMessage: boolean;
}

const SPEEDS = [0.75, 1, 1.5, 2];

export const AudioMessage: React.FC<AudioMessageProps> = ({ url, className, isMyMessage }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrent(time);
    }
  };

  const changeSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[nextIndex];
    }
  };

  return (
    <div className={`flex items-center gap-2 p-2 h-[60px] w-full max-w-[320px] ${className || ""}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className={clsx(isMyMessage ? "text-text-my-msg" : "text-text-other-msg", "w-8")}
        >
          {playing ? (
            <FontAwesomeIcon icon={faPause} className="text-lg"  />
          ) : (
            <FontAwesomeIcon icon={faPlay} className="text-lg pl-[2px]"  />
          )}
        </button>

        <div className="flex-1 flex flex-col gap-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={current}
            onChange={handleSeek}
            className="w-full h-1.5 bg-bg-sixth rounded-lg appearance-none cursor-pointer accent-primary-500"
          />

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {formatTime(current)} / {formatTime(duration)}
            </span>

            <button
              onClick={changeSpeed}
              className="text-xs bg-bg-fourth px-2 py-0.5 rounded-md font-bold transition-colors"
            >
              {SPEEDS[speedIndex]}x
            </button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
};
