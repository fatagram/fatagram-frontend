export const compressVideo = async (
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    videoBitsPerSecond?: number;
  },
): Promise<File> => {
  const maxWidth = options?.maxWidth ?? 1280;
  const maxHeight = options?.maxHeight ?? 720;
  const videoBitsPerSecond = options?.videoBitsPerSecond ?? 900_000;

  const sourceUrl = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.src = sourceUrl;
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    await new Promise<void>((resolve, reject) => {
      const onLoaded = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Failed to load video metadata"));
      };
      const cleanup = () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onError);
      };

      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onError);
    });

    const ratio = Math.min(maxWidth / video.videoWidth, maxHeight / video.videoHeight, 1);
    const targetWidth = Math.max(2, Math.floor((video.videoWidth * ratio) / 2) * 2);
    const targetHeight = Math.max(2, Math.floor((video.videoHeight * ratio) / 2) * 2);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to initialize video encoder");
    }

    const outputStream = canvas.captureStream(30);
    const videoWithCapture = video as HTMLVideoElement & {
      captureStream?: () => MediaStream;
    };
    const capturedVideoStream =
      typeof videoWithCapture.captureStream === "function"
        ? videoWithCapture.captureStream()
        : null;

    capturedVideoStream?.getAudioTracks().forEach((track: MediaStreamTrack) => {
      outputStream.addTrack(track);
    });

    const mimeTypeCandidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    const mimeType =
      mimeTypeCandidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ||
      "video/webm";

    const recorder = new MediaRecorder(outputStream, {
      mimeType,
      videoBitsPerSecond,
    });

    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    const recordPromise = new Promise<Blob>((resolve, reject) => {
      recorder.onerror = () => reject(new Error("Failed to compress video"));
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: mimeType }));
      };
    });

    const drawFrame = () => {
      if (video.paused || video.ended) {
        return;
      }
      context.drawImage(video, 0, 0, targetWidth, targetHeight);
      requestAnimationFrame(drawFrame);
    };

    recorder.start(100);

    try {
      await video.play();
    } catch {
      recorder.stop();
      throw new Error("Unable to start video compression playback");
    }

    drawFrame();

    await new Promise<void>((resolve) => {
      video.onended = () => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
        resolve();
      };
    });

    const compressedBlob = await recordPromise;

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const compressedFile = new File([compressedBlob], `${baseName}.webm`, {
      type: "video/webm",
      lastModified: file.lastModified,
    });

    if (compressedFile.size >= file.size) {
      return file;
    }

    return compressedFile;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
};
