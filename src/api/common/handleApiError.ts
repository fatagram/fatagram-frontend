import { ApiResponse } from "./apiResponse";
import { Result } from "./result";

export const handleApiError = (error: any): Result<any> => {
  if (error.name === "LARGE_FILE_ERROR") {
    return {
      success: false,
      errorCode: "LARGE_FILE_ERROR",
    };
  }
  if (error.response) {
    const err = error.response.data as ApiResponse<any>;
    return {
      success: false,
      errorCode: err.error?.code || "UNKNOWN_ERROR",
      errorCodes: err.error?.codes,
    };
  } else {
    return {
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR",
    };
  }
};
