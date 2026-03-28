import { Result } from "@/api/common/result";
import { buildApiPath, apiPost } from "../common/api-helpers";

const PREFIX = buildApiPath("/upload");

export class MessageService {
  public async getSignature(): Promise<
    Result<{
      apiKey: string;
      cloudName: string;
      timestamp: number;
      folder: string;
      overwrite: boolean;
      signature: string;
    }>
  > {
    return await apiPost(`${PREFIX}/signature`, {});
  }

  public async uploadImage(files: File[], signatureData: any): Promise<Result<{ url: string }[]>> {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;

    const uploadSingleFile = async (file: File): Promise<any> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", signatureData.timestamp.toString());
      formData.append("folder", signatureData.folder);
      formData.append("overwrite", signatureData.overwrite.toString());
      formData.append("signature", signatureData.signature);

      // Bỏ Header Content-Type đi để browser tự xử (Remove Content-Type header)
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Cloudinary upload failed");
      return response.json();
    };

    try {
      const uploadPromises = files.map((file) => uploadSingleFile(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map((res) => ({ url: res.secure_url }));

      return { success: true, data: urls };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          detail: "Failed to upload images. Please try again.",
        },
      };
    }
  }
}

export const messageService = new MessageService();
