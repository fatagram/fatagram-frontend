import { uploadService } from "@/api/upload/upload.api";
import { useState } from "react";

type ResourceType = "image" | "video" | "raw" | "auto";

export const useChatUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (
    files: File[],
    type: ResourceType = "auto",
  ): Promise<
    { url: string; type: string; original_filename: string; format: string; bytes: number }[]
  > => {
    setLoading(true);
    setError(null);

    try {
      const sigRes = await uploadService.getSignature("chat-messages", type);
      console.log("Signature response:", sigRes);
      if (!sigRes.success || !sigRes.data) throw new Error("Failed to get upload signature");

      const uploadRes = await uploadService.upload(files, sigRes.data);
      console.log("Upload response:", uploadRes);
      if (!uploadRes.success || !uploadRes.data) throw new Error("Failed to upload files");

      setLoading(false);
      return uploadRes.data;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      return [];
    }
  };

  return { upload, loading, error } as const;
};
