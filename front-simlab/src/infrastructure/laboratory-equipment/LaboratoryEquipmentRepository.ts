import { ILaboratoryEquipmentRepository } from "../../domain/laboratory-equipment/ILaboratoryEquipmentRepository";
import { LaboratoryEquipment } from "../../domain/laboratory-equipment/LaboratoryEquipment";
import { ApiResponse, PaginatedResponse } from "../../presentation/shared/Types";
import { fetchApi, jsonToFormData } from "../ApiClient";
import { LaboratoryEquipmentAPI, toDomain } from "./LaboratoryEquipmentAPI";
import { generateQueryStringFromObject } from "../Helper";

export class LaboratoryEquipmentRepository implements ILaboratoryEquipmentRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_laboratory_room?: number,
    }): Promise<PaginatedResponse<LaboratoryEquipment>> {
        const queryString = generateQueryStringFromObject(params)

        const response = await fetchApi(`/laboratory-equipments?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<LaboratoryEquipmentAPI>
            return {
                ...data,
                data: data.data.map(toDomain)
            }
        }
        throw json['message'];
    }

    async createData(data: {
        equipment_name: string;
        laboratory_room_id: number;
        quantity: number;
        unit: string;
        function: string;
        photo: string | File | null;
        brand: string;
        equipment_type: string;
        origin: string;
        condition: string;
        condition_description: string;
        asset_code: string
    }): Promise<ApiResponse> {
        const bodyFormData = jsonToFormData(data, 'POST')
        const response = await fetchApi('/laboratory-equipments', {
            method: 'POST',
            body: bodyFormData,
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: {
        equipment_name: string;
        laboratory_room_id: number;
        quantity: number;
        unit: string;
        function: string;
        photo: string | File | null;
        brand: string;
        equipment_type: string;
        origin: string;
        condition: string;
        condition_description: string;
        asset_code: string
    }): Promise<ApiResponse> {
        const bodyFormData = jsonToFormData(data, 'PUT')
        const response = await fetchApi(`/laboratory-equipments/${id}`, {
            method: 'POST',
            body: bodyFormData,
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async exportData(laboratoryRoomIds: number[]): Promise<void> {
        const params = new URLSearchParams()
        laboratoryRoomIds.forEach((id) => params.append('laboratory_room_ids[]', String(id)))
        const queryString = params.toString()

        const response = await fetchApi(`/laboratory-equipments/export${queryString ? `?${queryString}` : ''}`, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Gagal mengunduh data alat laboratorium')
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `master_alat_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/laboratory-equipments/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
}