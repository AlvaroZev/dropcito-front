/**
 * Authentication utility for managing API tokens
 */

const TOKEN_STORAGE_KEY = 'api_token';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

interface LoginResponse {
  success: boolean;
  token: string;
}

/**
 * Gets a valid authentication token, fetching a new one if needed
 */
export async function getAuthToken(): Promise<string | null> {
  // Check if we have a stored token
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  
  if (storedToken) {
    // TODO: Optionally validate token expiration here
    // For now, we'll try to use the stored token and fetch a new one if it fails
    return storedToken;
  }

  // No stored token, fetch a new one
  return await fetchAuthToken();
}

/**
 * Fetches a new authentication token from the login endpoint
 */
async function fetchAuthToken(): Promise<string | null> {
  try {
    const username = process.env.REACT_APP_API_USER || 'Public';
    const password = process.env.REACT_APP_API_PASSWORD || '';

    const response = await fetch(`${API_BASE_URL}/loginform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: username,
        password: password,
      }),
    });

    if (!response.ok) {
      console.error('Failed to authenticate:', response.status, response.statusText);
      return null;
    }

    const data: LoginResponse = await response.json();

    if (data.success && data.token) {
      // Store the token for future use
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      return data.token;
    }

    return null;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
}

/**
 * Clears the stored authentication token
 */
export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

