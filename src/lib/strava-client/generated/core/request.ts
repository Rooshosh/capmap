import { auth } from '@/auth';
import { getValidStravaAccessToken } from '@/strava';

type RequestOptions = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
};

export async function request<T>(options: RequestOptions): Promise<T> {
  const { url, method, headers, body, params } = options;

  // Get the session using Auth.js's auth() function
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('No user ID available');
  }

  const accessToken = await getValidStravaAccessToken(session.user.id);

  // Construct the URL with query parameters
  const queryParams = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';
  const fullUrl = `https://www.strava.com/api/v3${url}${queryParams}`;

  // Make the request
  const response = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  // Parse the response
  const data = await response.json();
  return data as T;
} 