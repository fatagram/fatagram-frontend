import { ApiResponse } from "./api-response";
import { Result } from "./result";

export const handleApiError = (error: any): Result<any> => {
  if (error.name === "LARGE_FILE_ERROR") {
    return {
      success: false,
      error: {
        code: "LARGE_FILE_ERROR",
        detail: "File size is too large. Please upload a smaller file.",
      },
    };
  }
  if (error.response) {
    const err = error.response.data as ApiResponse<any>;
    return {
      success: false,
      error: {
        code: err.error?.code || "UNKNOWN_ERROR",
        detail: err.error?.detail,
      },
      errors: err.errors,
    };
  } else {
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        detail: "Internal server error.",
      },
    };
  }
};
