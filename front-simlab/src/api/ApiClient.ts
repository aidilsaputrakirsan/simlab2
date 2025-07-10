const API_URL = 'http://localhost:8000/api'

interface RequestOptions extends RequestInit {
    token?: string;
}

export async function fetchApi(endpoint: string, options: RequestOptions = {}) {
    const { token, ...fetchOptions } = options;
    const headers = new Headers(options.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired');
    }

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return response.json();
}