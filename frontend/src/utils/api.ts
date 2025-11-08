import type { Role } from '../contexts/UserContext';

// 1. Define the base URL for our backend API
const API_BASE_URL = 'http://localhost:4000/api';

/**
 * A wrapper for the native fetch function that automatically
 * sets the API base URL and the required X-User-Role header.
 */
export const apiFetch = async (
  endpoint: string,
  role: Role,
  options: RequestInit = {} // e.g., method, body, etc.
) => {

  // 2. Set up our headers
  const headers = new Headers(options.headers);
  headers.set('X-User-Role', role); // Add our auth header
  
  // For POST requests with FormData, we let 'fetch' set Content-Type.
  // For JSON, we set it ourselves.
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 3. Make the fetch call
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: headers,
  });

  // 4. Handle errors
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  // 5. Return the JSON response
  return response.json();
};