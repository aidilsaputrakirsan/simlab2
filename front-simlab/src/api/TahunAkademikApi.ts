import { TahunAkademikResponse } from "../types/TahunAkademik";
import { fetchApi } from "./ApiClient";


export const TahunAkademikApi = {
    getData: async (token: string, options: Record<string, string|number>): Promise<TahunAkademikResponse> => {
        return fetchApi('/academic-year?' + new URLSearchParams(Object.entries(options).reduce((acc, [key, value]) => {
            acc[key] = value.toString();
            return acc;
        }, {} as Record<string, string>)), {
            method: 'GET',
            token,
        });
    },

    createData: async (token: string, data: unknown): Promise<TahunAkademikResponse> => {
        return fetchApi('/academic-year', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        });
    },

    updateData: async (token:string, id:number, data: unknown): Promise<TahunAkademikResponse> => {
        return fetchApi(`/academic-year/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token
        });
    },

    toggleStatus: async (token: string, id:number): Promise<TahunAkademikResponse> => {
        return fetchApi(`/academic-year/${id}/toggle-status`, {
            method: 'PUT',
            token
        })
    },

    deleteData: async (token: string, id:number): Promise<TahunAkademikResponse> => {
        return fetchApi(`/academic-year/${id}`, {
            method: 'DELETE',
            token
        });
    }
}