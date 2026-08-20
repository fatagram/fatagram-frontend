import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileZipper,
  faFileCode,
  faFileAudio,
  faFileVideo,
  faFileImage,
  faFile,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export interface FileIconInfo {
  icon: IconDefinition;
  color: string;
}

/**
 * Returns a FontAwesome icon and tailored background/color classes based on file extension and MIME type.
 */
export const getFileIcon = (fileName: string, mimeType?: string): FileIconInfo => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  if (["pdf"].includes(ext) || mimeType?.includes("pdf")) {
    return { icon: faFilePdf, color: "text-red-500 bg-red-500/10" };
  }
  if (["doc", "docx"].includes(ext) || mimeType?.includes("word") || mimeType?.includes("document")) {
    return { icon: faFileWord, color: "text-blue-500 bg-blue-500/10" };
  }
  if (
    ["xls", "xlsx", "csv"].includes(ext) ||
    mimeType?.includes("sheet") ||
    mimeType?.includes("excel")
  ) {
    return { icon: faFileExcel, color: "text-emerald-500 bg-emerald-500/10" };
  }
  if (
    ["zip", "rar", "7z", "tar", "gz"].includes(ext) ||
    mimeType?.includes("zip") ||
    mimeType?.includes("compressed")
  ) {
    return { icon: faFileZipper, color: "text-amber-500 bg-amber-500/10" };
  }
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "py", "cpp", "cs", "java", "sql", "sh"].includes(ext)) {
    return { icon: faFileCode, color: "text-purple-500 bg-purple-500/10" };
  }
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext) || mimeType?.includes("audio")) {
    return { icon: faFileAudio, color: "text-pink-500 bg-pink-500/10" };
  }
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext) || mimeType?.includes("video")) {
    return { icon: faFileVideo, color: "text-cyan-500 bg-cyan-500/10" };
  }
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext) || mimeType?.includes("image")) {
    return { icon: faFileImage, color: "text-teal-500 bg-teal-500/10" };
  }
  return { icon: faFile, color: "text-text-third bg-bg-fourth" };
};

/**
 * Extract a human-readable file name from metadata or URL.
 */
export const getMediaFileName = (url: string, metadataName?: string, defaultName = "Tập tin"): string => {
  if (metadataName) return metadataName;
  try {
    const parts = url.split("/");
    const rawName = parts.at(-1) || defaultName;
    return decodeURIComponent(rawName.split("?")[0]);
  } catch {
    return defaultName;
  }
};
