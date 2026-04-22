import { useRef, useState } from "react";
import { ComponentProps } from "@/components/common/component-type";
import { Button } from "@/components/atoms";
import clsx from "clsx";

interface VideoMessageProps extends ComponentProps {
  url: string;
  onFullscreenToggle?: () => void;
  onFrameClick?: () => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.5, 2];

export const VideoMessage: React.FC<VideoMessageProps> = ({
  url,
  className,
  onFullscreenToggle,
  onFrameClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const formatTime = (seconds: number, totalDuration: number) => {
    const displaySeconds = Math.min(seconds, totalDuration);
    const mins = Math.floor(displaySeconds / 60);
    const secs = Math.floor(displaySeconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      setCurrentTime(videoRef.current.duration);
    }
  };

  const handleInitialPlay = () => {
    setHasStarted(true);
    videoRef.current?.play();
  };

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (videoRef.current) {
      if (newMutedState) {
        videoRef.current.volume = 0;
      } else {
        const restoreVolume = volume === 0 ? 1 : volume;
        setVolume(restoreVolume);
        videoRef.current.volume = restoreVolume;
      }
    }
  };

  const safeTimeRatio = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const timeFillPercent = `${safeTimeRatio * 100}%`;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative group bg-black overflow-hidden flex items-center justify-center transition-all duration-300",
        "w-[280px] sm:w-[320px] aspect-video min-h-[157px] sm:min-h-[180px] rounded-2xl shadow-sm shrink-0",
        className,
      )}
    >
      <video
        ref={videoRef}
        src={url}
        className={clsx(
          "w-full h-full object-cover cursor-pointer transition-opacity duration-300",
          !hasStarted ? "opacity-60" : "opacity-100",
        )}
        onClick={() => {
          if (onFrameClick) {
            onFrameClick();
            return;
          }

          if (hasStarted) {
            togglePlay();
            return;
          }

          handleInitialPlay();
        }}
        onWaiting={() => setIsWaiting(true)}
        onCanPlay={() => setIsWaiting(false)}
        onPlaying={() => {
          setIsPlaying(true);
          setIsWaiting(false);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={onVideoEnded}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        muted={isMuted}
        playsInline
      />

      {!hasStarted && (
        <Button
          onClick={handleInitialPlay}
          className={clsx(
            "absolute z-10",
            "w-14 h-14 !rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all hover:bg-black/60 hover:scale-105 active:scale-95",
          )}
        >
          <i className="fa-solid fa-play text-xl pl-[2px]" />
        </Button>
      )}

      {isWaiting && hasStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/20">
          <i className="fa-solid fa-spinner fa-spin text-white text-3xl opacity-80" />
        </div>
      )}

      {hasStarted && (
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300",
            isPlaying && !isWaiting ? "opacity-0 group-hover:opacity-100" : "opacity-100",
          )}
        >
          <div className="relative w-full h-3 flex items-center mb-2 cursor-pointer group/seek">
            <div className="relative w-full h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-primary-500"
                style={{ width: timeFillPercent }}
              />
            </div>
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-primary-500 shadow-md -translate-x-1/2 opacity-0 group-hover/seek:opacity-100 transition-opacity"
              style={{ left: timeFillPercent }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-white drop-shadow-md">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-primary-400 transition-colors w-4">
                <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"} text-sm`}></i>
              </button>

              <div className="flex items-center group/volume relative">
                <button
                  onClick={toggleMute}
                  className="hover:text-primary-400 transition-colors w-4 shrink-0"
                >
                  <i
                    className={`fas ${
                      isMuted || volume === 0
                        ? "fa-volume-mute"
                        : volume < 0.5
                          ? "fa-volume-down"
                          : "fa-volume-up"
                    } text-sm`}
                  ></i>
                </button>

                <div className="hidden sm:flex items-center overflow-hidden w-0 opacity-0 group-hover/volume:w-16 group-hover/volume:opacity-100 group-hover/volume:ml-2 transition-all duration-300 ease-in-out">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 accent-primary-500 cursor-pointer appearance-none bg-white/30 rounded-full"
                    style={{
                      background: `linear-gradient(to right, rgb(var(--primary-500)) ${volumePercent}%, rgba(255,255,255,0.3) ${volumePercent}%)`,
                    }}
                  />
                </div>
              </div>

              <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-medium tabular-nums">
                {formatTime(currentTime, duration)} / {formatTime(duration, duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const nextIndex =
                    (SPEED_OPTIONS.indexOf(playbackRate) + 1) % SPEED_OPTIONS.length;
                  const newSpeed = SPEED_OPTIONS[nextIndex];
                  setPlaybackRate(newSpeed);
                  if (videoRef.current) videoRef.current.playbackRate = newSpeed;
                }}
                className="text-[9px] font-bold border border-white/50 px-1.5 py-0.5 rounded-md hover:bg-white/20 transition-all uppercase w-8 text-center"
              >
                {playbackRate}x
              </button>

              {onFullscreenToggle && (
                <button
                  onClick={onFullscreenToggle}
                  className="hover:text-primary-400 transition-colors w-4 text-right"
                >
                  <i className={`fas fa-expand text-sm`}></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
