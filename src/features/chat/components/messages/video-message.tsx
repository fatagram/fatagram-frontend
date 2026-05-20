import { useRef, useState, useCallback, useEffect } from "react";
import { ComponentProps } from "@/components/common/component-type";
import { Button } from "@/components/atoms";
import clsx from "clsx";
import { useMediaBlob } from "@/hooks/use-media-blob";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faSpinner,
  faPause,
  faVolumeMute,
  faVolumeDown,
  faVolumeUp,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";

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
  const animationRef = useRef<number>(null);

  const { blobUrl: posterBlobUrl } = useMediaBlob(url.replace(/\.[^/.]+$/, ".jpg"));

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressThumbRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);
  const seekInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime || 0;
    const duration = video.duration || 0;

    const isDurationValid = isFinite(duration) && !isNaN(duration) && duration > 0;

    const ratio = isDurationValid ? Math.min(currentTime / duration, 1) : 0;
    const percent = `${ratio * 100}%`;

    if (progressBarRef.current) progressBarRef.current.style.width = percent;
    if (progressThumbRef.current) progressThumbRef.current.style.left = percent;

    if (seekInputRef.current) {
      if (isDurationValid && seekInputRef.current.max !== String(duration)) {
        seekInputRef.current.max = String(duration);
      }
      if (seekInputRef.current.value !== String(currentTime)) {
        seekInputRef.current.value = String(currentTime);
      }
    }

    if (timeDisplayRef.current) {
      const formattedCurrent = formatTime(currentTime);
      const formattedDuration = isDurationValid ? formatTime(duration) : "--:--";
      const newText = `${formattedCurrent} / ${formattedDuration}`;

      if (timeDisplayRef.current.textContent !== newText) {
        timeDisplayRef.current.textContent = newText;
      }
    }
  }, []);

  useEffect(() => {
    const loop = () => {
      updateProgress();
      animationRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateProgress]);

  // Hack giải quyết lỗi (Hack to resolve the issue) WebM Infinity duration
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.duration === Infinity) {
      // Ép trình duyệt tìm EOF (Force browser to find EOF)
      video.currentTime = 1e101;

      const resetTime = () => {
        video.currentTime = 0;
        video.removeEventListener("timeupdate", resetTime);
        updateProgress();
      };

      video.addEventListener("timeupdate", resetTime);
    } else {
      updateProgress();
    }
  }, [updateProgress]);

  const handleInitialPlay = useCallback(() => {
    setHasStarted(true);
    videoRef.current?.play().catch(() => setIsPlaying(false));
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, []);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value);
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        updateProgress();
      }
    },
    [updateProgress],
  );

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.muted = newVolume === 0;
      videoRef.current.volume = newVolume === 0 ? 0 : newVolume;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      video.muted = true;
    } else {
      const restoreVolume = volume === 0 ? 1 : volume;
      setVolume(restoreVolume);
      video.muted = false;
      video.volume = restoreVolume;
    }
  }, [isMuted, volume]);

  const handleSpeedToggle = useCallback(() => {
    const nextIndex = (SPEED_OPTIONS.indexOf(playbackRate) + 1) % SPEED_OPTIONS.length;
    const newSpeed = SPEED_OPTIONS[nextIndex];
    setPlaybackRate(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
  }, [playbackRate]);

  const onVideoEnded = useCallback(() => {
    setIsPlaying(false);
    updateProgress();
  }, [updateProgress]);

  useEffect(() => {
    if (hasStarted) {
      updateProgress();
    }
  }, [hasStarted, updateProgress]);

  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative group bg-black overflow-hidden flex items-center justify-center transition-all duration-300",
        "select-none",
        className,
      )}
    >
      <video
        ref={videoRef}
        src={url}
        poster={posterBlobUrl || url.replace(/\.[^/.]+$/, ".jpg")}
        preload="none"
        className={`w-full h-full object-contain cursor-pointer ${!hasStarted ? "opacity-60" : "opacity-100"}`}
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
        onCanPlay={() => {
          setIsWaiting(false);
          updateProgress();
        }}
        onPlaying={() => {
          setIsPlaying(true);
          setIsWaiting(false);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={onVideoEnded}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={handleLoadedMetadata} // Áp dụng hàm fix tại đây (Apply the fix function here)
        onDurationChange={updateProgress}
        onProgress={updateProgress}
        playsInline
      />

      {!hasStarted && (
        <Button
          onClick={handleInitialPlay}
          className={clsx(
            "absolute z-10",
            "w-16 h-16 !rounded-full text-white flex items-center justify-center transition-all active:scale-98",
          )}
        >
          <FontAwesomeIcon icon={faPlay} className="text-2xl pl-[2px]" />
        </Button>
      )}

      {isWaiting && hasStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl opacity-80" />
        </div>
      )}

      {hasStarted && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300 
          ${isPlaying && !isWaiting ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
        >
          <div className="relative w-full h-4 flex items-center mb-4 cursor-pointer group/seek">
            <div className="relative w-full h-1.5 rounded-full bg-white/30 overflow-hidden">
              <div
                ref={progressBarRef}
                className="absolute left-0 top-0 h-full rounded-full bg-primary-500"
              />
            </div>
            <div
              ref={progressThumbRef}
              className="absolute w-3.5 h-3.5 rounded-full bg-primary-500 shadow-md -translate-x-1/2"
            />
            <input
              ref={seekInputRef}
              type="range"
              min={0}
              step="0.1"
              defaultValue={0}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-white drop-shadow-md">
            <div className="flex items-center gap-6">
              <button onClick={togglePlay} className="hover:text-primary-400 transition-colors w-5">
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-xl" />
              </button>

              <div className="flex items-center relative">
                <button
                  onClick={() => {
                    setIsVolumeOpen((prev) => !prev);
                    toggleMute();
                  }}
                  className="hover:text-primary-400 transition-colors w-5 shrink-0"
                >
                  <FontAwesomeIcon
                    icon={
                      isMuted || volume === 0
                        ? faVolumeMute
                        : volume < 0.5
                          ? faVolumeDown
                          : faVolumeUp
                    }
                  />
                </button>

                <div
                  className={clsx(
                    "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
                    "sm:w-0 sm:opacity-0 sm:group-hover/volume:w-20 sm:group-hover/volume:opacity-100 sm:ml-0 sm:group-hover/volume:ml-2",
                    isVolumeOpen ? "w-20 opacity-100 ml-2" : "w-0 opacity-0 ml-0",
                  )}
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 accent-primary-500 cursor-pointer appearance-none bg-white/30 rounded-full"
                    style={{
                      background: `linear-gradient(to right, rgb(var(--primary-500)) ${volumePercent}%, rgba(255,255,255,0.3) ${volumePercent}%)`,
                    }}
                  />
                </div>
              </div>

              <span
                ref={timeDisplayRef}
                className="text-xs bg-black/40 px-2 py-1 rounded font-semibold tabular-nums"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSpeedToggle}
                className="text-[10px] font-black border-2 border-white/50 px-2 py-0.5 rounded-lg hover:bg-white/20 transition-all uppercase w-10 text-center"
              >
                {playbackRate}x
              </button>

              {onFullscreenToggle && (
                <button
                  onClick={onFullscreenToggle}
                  className="hover:text-primary-400 transition-colors w-5 text-right"
                >
                  <FontAwesomeIcon icon={faExpand} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
