import { ILaboratoryMaterialRepository } from "../../domain/laboratory-material/ILaboratoryMaterialRepository";
import { LaboratoryMaterial } from "../../domain/laboratory-material/LaboratoryMaterial";
import { ApiResponse, PaginatedResponse } from "../../presentation/shared/Types";
import { fetchApi } from "../ApiClient";
import { LaboratoryMaterialAPI, toDomain } from "./LaboratoryMaterialAPI";
import { generateQueryStringFromObject } from "../Helper";

export class LaboratoryMaterialRepository implements ILaboratoryMaterialRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_laboratory_room?: number,
    }): Promise<PaginatedResponse<LaboratoryMaterial>> {
        const queryString = generateQueryStringFromObject(params)
        const response = await fetchApi(`/laboratory-materials?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<LaboratoryMaterialAPI>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            }
        }
        throw json['message'];
    }

    async createData(data: {
        code: string;
        material_name: string;
        brand: string;
        stock: number;
        unit: string;
        purchase_date: Date | undefined;
        expiry_date: Date | undefined;
        description: string;
        refill_date: Date | undefined;
        student_price: number | null;
        lecturer_price: number | null;
        external_price: number | null;
    }): Promise<ApiResponse> {
        const response = await fetchApi('/laboratory-materials', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: {
        code: string;
        material_name: string;
        brand: string;
        stock: number;
        unit: string;
        purchase_date: Date | undefined;
        expiry_date: Date | undefined;
        description: string;
        refill_date: Date | undefined;
        student_price: number | null;
        lecturer_price: number | null;
        external_price: number | null;
    }): Promise<ApiResponse> {
        const response = await fetchApi(`/laboratory-materials/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/laboratory-materials/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async importData(file: File): Promise<ApiResponse<{
        imported: number;
        updated: number;
        failed: { row: number; errors: string[] }[];
    }>> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetchApi('/laboratory-materials/import', {
            method: 'POST',
            body: formData,
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async downloadTemplate(): Promise<void> {
        const response = await fetchApi('/laboratory-materials/import/template', { method: 'GET' });

        if (!response.ok) {
            throw new Error('Gagal mengunduh template')
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'template_import_bahan.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}