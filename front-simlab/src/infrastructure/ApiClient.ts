import { StorageManager } from "./StorageManager";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL + '/api'

interface RequestOptions extends RequestInit {
    token?: string;
    isFormData?: boolean
}

export async function fetchApi(endpoint: string, options: RequestOptions = {}) {
    const headers = new Headers(options.headers);

    const isFormData = options.body instanceof FormData;

    if (StorageManager.hasSession()) {
        headers.set('Authorization', `Bearer ${StorageManager.getAccessToken()}`);
    }

    // Only set content-type if not FormData (browser sets boundary for FormData automatically)
    if (!isFormData) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    // Wrap response to handle non-JSON errors gracefully
    const originalJson = response.json.bind(response);
    response.json = async () => {
        const text = await response.clone().text();
        try {
            return JSON.parse(text);
        } catch {
            // Server returned non-JSON (likely PHP/HTML error)
            // Check for common PHP upload errors
            if (text.includes('upload_max_filesize') || text.includes('post_max_size')) {
                throw {
                    message: 'Ukuran file terlalu besar. Maksimal 2MB.',
                    errors: ['File melebihi batas ukuran yang diizinkan server.']
                };
            }
            if (text.includes('Maximum execution time')) {
                throw {
                    message: 'Server timeout. Silakan coba lagi.',
                    errors: ['Proses memakan waktu terlalu lama.']
                };
            }
            // Generic server error
            throw {
                message: 'Terjadi kesalahan pada server.',
                errors: ['Server mengembalikan respons yang tidak valid. Silakan hubungi administrator.']
            };
        }
    };

    return response;
}

export function jsonToFormData(obj: Record<string, any>, method: 'POST' | 'PUT' | 'DELETE'): FormData {
    const formData = new FormData();
    formData.append('_method', method)
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });
    
    return formData;
}
