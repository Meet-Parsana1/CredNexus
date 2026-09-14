/**
 * CredNexus Client API Wrapper
 * Typed client-side fetch helper for CredNexus backend endpoints.
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.error || `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    return json;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network request failed',
    };
  }
}

export const api = {
  schemes: {
    list: (category?: string, search?: string) => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';
      return fetchApi<any[]>(`/schemes${query}`);
    },
  },
  recommend: (criteria: any) =>
    fetchApi<any[]>('/recommend', {
      method: 'POST',
      body: JSON.stringify(criteria),
    }),
  calculator: (params: any) =>
    fetchApi<any>('/calculator', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  eligibility: (data: any) =>
    fetchApi<any>('/eligibility', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  partners: {
    list: (params?: any) =>
      params
        ? fetchApi<any[]>('/partners', {
            method: 'POST',
            body: JSON.stringify(params),
          })
        : fetchApi<any[]>('/partners'),
  },
};
