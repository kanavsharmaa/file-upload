import type { Role } from '@/types';

// 1. Define the base URL for our backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Interface for API error data
 */
interface ApiError {
  message: string;
  statusCode?: number;
}

/**
 * Custom error class for API exceptions
 */
class ApiException extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
  }
}

/**
 * A wrapper for the native fetch function that automatically
 * sets the API base URL and the required X-User-Role header.
 */
export const apiFetch = async <T = unknown>(
  endpoint: string,
  role: Role,
  options: RequestInit = {} // e.g., method, body, etc.
): Promise<T> => {

  // 2. Set up our headers
  const headers = new Headers(options.headers);
  headers.set('X-User-Role', role); // Add our auth header
  
  // For POST requests with FormData, we let 'fetch' set Content-Type.
  // For JSON, we set it ourselves.
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    // 3. Make the fetch call
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: headers,
    });

    // 4. Handle errors
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'API request failed', statusCode: response.status };
      }
      throw new ApiException(
        errorData.message || `Request failed with status ${response.status}`,
        response.status
      );
    }

    // 5. Return the JSON response
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
};