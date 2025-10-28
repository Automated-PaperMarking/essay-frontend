/**
 * Utility functions for handling API errors and displaying user-friendly messages
 */

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// Status code to error message mapping
const STATUS_CODE_MESSAGES: Record<number, string> = {
  400: ERROR_MESSAGES.VALIDATION_ERROR,
  401: ERROR_MESSAGES.UNAUTHORIZED,
  403: ERROR_MESSAGES.FORBIDDEN,
  404: ERROR_MESSAGES.NOT_FOUND,
  500: ERROR_MESSAGES.SERVER_ERROR,
  502: ERROR_MESSAGES.SERVER_ERROR,
  503: ERROR_MESSAGES.SERVER_ERROR,
  504: ERROR_MESSAGES.SERVER_ERROR,
};

/**
 * Extracts a user-friendly error message from various error formats
 */
export function getErrorMessage(error: unknown): string {
  // If it's already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // If it's an Error object
  if (error instanceof Error) {
    return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  // If it's an object with a message property
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }

  // If it's an object with response.status (axios error format)
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as { response?: { status?: number; data?: { message?: string } } }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }

    if (response?.status && STATUS_CODE_MESSAGES[response.status]) {
      return STATUS_CODE_MESSAGES[response.status];
    }
  }

  // If it's an object with status property
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === "number" && STATUS_CODE_MESSAGES[status]) {
      return STATUS_CODE_MESSAGES[status];
    }
  }

  // Fallback to unknown error
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Determines if an error is due to network connectivity issues
 */
export function isNetworkError(error: unknown): boolean {
  if (typeof error === "string") {
    return (
      error.toLowerCase().includes("network") ||
      error.toLowerCase().includes("connection")
    );
  }

  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes("network") ||
      error.message.toLowerCase().includes("connection") ||
      error.name === "NetworkError"
    );
  }

  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: unknown }).code;
    return (
      code === "NETWORK_ERROR" ||
      code === "ECONNREFUSED" ||
      code === "ETIMEDOUT"
    );
  }

  return false;
}

/**
 * Determines if an error is due to authentication issues
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    return response?.status === 401 || response?.status === 403;
  }

  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status: unknown }).status;
    return status === 401 || status === 403;
  }

  return false;
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(
  errors: Record<string, string[]>
): string[] {
  const messages: string[] = [];

  Object.entries(errors).forEach(([field, fieldErrors]) => {
    fieldErrors.forEach((error) => {
      messages.push(`${field}: ${error}`);
    });
  });

  return messages;
}

/**
 * Creates a retry function for failed operations
 */
export function createRetryHandler(
  operation: () => Promise<void>,
  maxRetries: number = 3,
  delay: number = 1000
) {
  let retryCount = 0;

  const retry = async (): Promise<void> => {
    try {
      await operation();
    } catch (error) {
      retryCount++;

      if (retryCount >= maxRetries) {
        throw error;
      }

      // Don't retry auth errors
      if (isAuthError(error)) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * retryCount));
      return retry();
    }
  };

  return retry;
}
