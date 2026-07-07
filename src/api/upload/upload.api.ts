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
      resourceType: string;
    }>
  > {
    return await apiGet(`${PREFIX}/signature?folder=${folder}&resourceType=${resourceType}`, {});
  }

  public async upload(
    file: File,
    resourceType: string,
  ): Promise<
    Result<{
      url: string;
      type: string;
      original_filename: string;
      bytes: number;
      width?: number;
      height?: number;
    }>
  > {
    const signatureData = (await this.getSignature("chat-messages", resourceType)).data;
    if (!signatureData) {
      return {
        success: false,
        error: {
          detail: "Failed to get upload signature",
          code: "UPLOAD_SIGNATURE_ERROR",
        },
      };
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${signatureData.resourceType}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", signatureData.folder);
    formData.append("overwrite", String(signatureData.overwrite));
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("resource_type", signatureData.resourceType);
    formData.append("api_key", signatureData.apiKey);
    formData.append("signature", signatureData.signature);

    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      }).catch((err) => {
        console.error("Network error during upload:", err);
        throw new Error("Network error during upload");
      });
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Cloudinary Detailed Error:", errorBody);
        return {
          success: false,
          error: {
            detail: `Upload failed with status ${response.status}`,
            code: "UPLOAD_ERROR",
          },
        };
      }

      const _res = await response.json();
      const extension = _res.display_name.split(".").pop();
      return {
        success: true,
        data: {
          url: _res.secure_url,
          type: _res.resource_type,
          original_filename: `${_res.original_filename}.${extension}`,
          bytes: _res.bytes,
          width: _res.width,
          height: _res.height,
        },
      };
    } catch (err) {
      console.error("Upload error:");
      return {
        success: false,
        error: {
          detail: err instanceof Error ? err.message : "Unknown error",
          code: "UPLOAD_EXCEPTION",
        },
      };
    }
  }
}

export const uploadService = new UploadService();
