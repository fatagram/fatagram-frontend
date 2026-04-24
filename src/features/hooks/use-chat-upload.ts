import { uploadService } from "@/api/upload/upload.api";
import { getCloudinaryResourceTypeFromFileType } from "@/utils/file";
import { useState } from "react";

export const useChatUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (
    files: File[],
  ): Promise<{ url: string; type: string; original_filename: string; bytes: number }[]> => {
    setLoading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadService.upload(
          file,
          getCloudinaryResourceTypeFromFileType(file.type),
        );
        if (!result.success || !result.data) {
          throw new Error(result.error?.detail || "Upload failed");
        }
        return result.data;
      });
      const results = await Promise.all(uploadPromises);
      setLoading(false);
      return results;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      return [];
    }
  };

  return { upload, loading, error } as const;
};
