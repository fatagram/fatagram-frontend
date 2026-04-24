/**
 * Compress image file to reduce size while maintaining reasonable quality
 * @param file - Image file to compress
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Compressed image as File object
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: file.lastModified,
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          quality,
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      const result = event.target?.result;
      if (typeof result === "string") {
        img.src = result;
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Compress multiple images
 * @param files - Array of image files
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - Compression quality 0-1
 * @returns Array of compressed files
 */
export const compressImages = async (
  files: File[],
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8,
): Promise<File[]> => {
  return Promise.all(files.map((file) => compressImage(file, maxWidth, maxHeight, quality)));
};

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
