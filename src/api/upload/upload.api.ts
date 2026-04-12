import { Result } from "@/api/common/result";
import { buildApiPath, apiGet } from "../common/api-helpers";

const PREFIX = buildApiPath("/upload");

export class UploadService {
  public async getSignature(
    folder: string,
    resourceType: string,
  ): Promise<
    Result<{
      apiKey: string;
      cloudName: string;
      timestamp: number;
      folder: string;
      overwrite: boolean;
      signature: string;
    }>
  > {
    return await apiGet(`${PREFIX}/signature?folder=${folder}&resourceType=${resourceType}`, {});
  }

  public async upload(
    files: File[],
    signatureData: any,
  ): Promise<Result<{ url: string; type: string; original_filename: string; bytes: number }[]>> {
    console.log("Starting upload with signature data:", signatureData);
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${signatureData.resourceType}/upload`;

    const uploadSingleFile = async (file: File): Promise<any> => {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", signatureData.folder);
      formData.append("overwrite", String(signatureData.overwrite));
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("resource_type", signatureData.resourceType);
      formData.append("api_key", signatureData.apiKey);
      formData.append("signature", signatureData.signature);

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Cloudinary Detailed Error:", errorBody);
        throw new Error(errorBody.error?.message || "Upload failed");
      }

      return response.json();
    };

    try {
      const uploadPromises = files.map((file) => uploadSingleFile(file));
      const results = await Promise.all(uploadPromises);
      console.log("Upload results:", results);
      const urls = await Promise.all(
        files.map(async (file) => {
          const res = await uploadSingleFile(file);
          const extension = res.display_name.split(".").pop();
          return {
            url: res.secure_url,
            type: res.resource_type,
            original_filename: `${res.original_filename}.${extension}`,
            bytes: res.bytes,
          };
        }),
      );

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

export const uploadService = new UploadService();
