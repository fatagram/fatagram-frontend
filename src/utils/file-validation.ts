export enum FileValidationError {
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  NO_FILES = "NO_FILES",
}

/**
 * Maximum file size in bytes (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Allowed file types for different categories
 */
export const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ],
};

/**
 * Validate if file size is within limit
 * @param file - File to validate
 * @param maxSize - Maximum size in bytes (default: 50MB)
 * @returns Validation result
 */
export const validateFileSize = (
  file: File,
  maxSize: number = MAX_FILE_SIZE,
): { valid: boolean; error?: FileValidationError } => {
  if (file.size > maxSize) {
    return { valid: false, error: FileValidationError.FILE_TOO_LARGE };
  }
  return { valid: true };
};

/**
 * Validate if file type is allowed
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[] = [],
): { valid: boolean; error?: FileValidationError } => {
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: FileValidationError.INVALID_FILE_TYPE };
  }
  return { valid: true };
};

/**
 * Validate multiple files
 * @param files - Array of files to validate
 * @param maxSize - Maximum size per file in bytes
 * @param allowedTypes - Array of allowed MIME types
 * @returns Array of validation results for each file
 */
export const validateFiles = (
  files: File[],
  maxSize: number = MAX_FILE_SIZE,
  allowedTypes: string[] = [],
): Array<{ file: File; valid: boolean; error?: FileValidationError }> => {
  if (files.length === 0) {
    return [];
  }

  return files.map((file) => {
    const sizeValidation = validateFileSize(file, maxSize);
    if (!sizeValidation.valid) {
      return { file, valid: false, error: sizeValidation.error };
    }

    const typeValidation = validateFileType(file, allowedTypes);
    if (!typeValidation.valid) {
      return { file, valid: false, error: typeValidation.error };
    }

    return { file, valid: true };
  });
};

/**
 * Get file size in MB
 * @param file - File to get size from
 * @returns File size in MB (rounded to 2 decimal places)
 */
export const getFileSizeInMB = (file: File): number => {
  return Math.round((file.size / (1024 * 1024)) * 100) / 100;
};

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns Formatted size string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
