import { TOKEN_KEY } from './types';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

// Ensure the BASE_URL is correct for mobile (physical devices need IP instead of localhost)
// For development, you might want to use your machine's local IP address.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5001';

/**
 * Reusable fetch utility with automatic token injection and base URL.
 */
export async function $fetch<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  
  // Get token from SecureStore
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  
  const headers = new Headers(options.headers || {});
  
  // Add JSON content type if body is present and not already set
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add Authorization header if token exists
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' 
      ? JSON.stringify(options.body) 
      : (options.body as BodyInit),
  };

  try {
    const response = await fetch(fullUrl, config);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Fetch failed: ${response.status}`);
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}
