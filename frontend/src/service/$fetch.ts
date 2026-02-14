import { TOKEN_KEY } from '@/types/shared';

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Reusable fetch utility with automatic token injection and base URL.
 * 
 * Usage:
 * const data = await $fetch<MyResponseType>('/endpoint', { 
 *   method: 'POST', 
 *   body: { key: 'value' } 
 * });
 */
export async function $fetch<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  
  // Get token from localStorage
  const token = localStorage.getItem(TOKEN_KEY);
  
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
