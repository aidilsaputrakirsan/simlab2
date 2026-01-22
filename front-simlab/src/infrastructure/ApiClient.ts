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
