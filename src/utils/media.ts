import { MediaType } from "@/types/entities/message.type";

export const getMediaTypeFromCloudinary = (resourceType: string): MediaType => {
  switch (resourceType) {
    case "image":
      return MediaType.Image;
    case "video":
      return MediaType.Video;
    case "audio":
      return MediaType.Audio;
    default:
      return MediaType.File;
  }
};

export const getMediaTypeFromFileType = (fileType: string): MediaType => {
  switch (fileType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
    case "image/webp":
    case "image/svg+xml":
    case "image/bmp":
    case "image/tiff":
      return MediaType.Image;
    case "video/mp4":
    case "video/webm":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/mpeg":
    case "video/ogg":
    case "video/3gpp":
      return MediaType.Video;
    case "audio/mpeg":
    case "audio/wav":
    case "audio/ogg":
    case "audio/aac":
    case "audio/flac":
    case "audio/x-m4a":
    case "audio/mp4":
    case "audio/webm":
    case "audio/opus":
      return MediaType.Audio;
    default:
      return MediaType.File;
  }
};

export const getCloudinaryResourceTypeFromFileType = (fileType: string): string => {
  switch (fileType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
    case "image/webp":
    case "image/svg+xml":
    case "image/bmp":
    case "image/tiff":
      return "image";
    case "video/mp4":
    case "video/webm":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/mpeg":
    case "video/ogg":
    case "video/3gpp":
    case "audio/mpeg":
    case "audio/wav":
    case "audio/ogg":
    case "audio/aac":
    case "audio/flac":
    case "audio/x-m4a":
    case "audio/mp4":
    case "audio/webm":
    case "audio/opus":
      return "video";
    default:
      return "raw";
  }
};
