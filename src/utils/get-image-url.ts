import appConfig from "@/config";

const API_URL = appConfig.apiUrl;

export function getImageUrl(imagePath: string | null | undefined): string | undefined {
  if (!imagePath) {
    return undefined;
  }
  return `${API_URL}/${imagePath}`;
}