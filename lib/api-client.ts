/**
 * Alogyan API Client
 * Base URL and configuration for REST & GraphQL APIs
 */

// API Configuration - Uses Next.js API routes (same origin)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql';

/**
 * Get Firebase ID token from current user
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const { auth } = await import('./firebase');
  const { currentUser } = auth;

  if (!currentUser) {
    return null;
  }

  try {
    const token = await currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Standard API response envelope
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    nextCursor?: string;
    hasMore?: boolean;
  };
  timestamp?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Common fetch options with auth header
 */
async function getFetchOptions(options: RequestInit = {}): Promise<RequestInit> {
  const token = await getAuthToken();

  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };
}

/**
 * Handle API response with standard error handling
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type');

  // Handle no content responses
  if (response.status === 204) {
    return { success: true } as ApiResponse<T>;
  }

  // Parse JSON or text
  let data: unknown;
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Handle error responses
  if (!response.ok) {
    const errorData = data as Record<string, unknown> | undefined;
    return {
      success: false,
      error: {
        code: (errorData?.code as string) || 'API_ERROR',
        message: (errorData?.message as string) || 'An error occurred',
        details: errorData?.details,
      },
    };
  }

  return data as ApiResponse<T>;
}

/**
 * REST API Client
 */
export const api = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const base =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL(`${API_BASE_URL}${endpoint}`, base);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options = await getFetchOptions();
    const response = await fetch(url.toString(), options);
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const options = await getFetchOptions({
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  },

  /**
   * PATCH request (partial update)
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const options = await getFetchOptions({
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const options = await getFetchOptions({
      method: 'DELETE',
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  },

  /**
   * Upload file and get signed URL
   */
  async uploadFile(file: File, endpoint: string): Promise<{ uploadUrl: string; storageKey: string }> {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSizeBytes: file.size,
      }),
    });

    const result = await handleResponse<{ uploadUrl: string; storageKey: string }>(response);

    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Failed to get upload URL');
    }

    // Upload file to the signed URL
    const uploadResponse = await fetch(result.data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    return result.data;
  },
};

/**
 * GraphQL Client
 */
export const graphql = {
  /**
   * Execute GraphQL query or mutation
   */
  async execute<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const token = await getAuthToken();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result.data as T;
  },
};

// Export constants
export { API_BASE_URL, GRAPHQL_ENDPOINT };
