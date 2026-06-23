import { ApiResponse, PaginatedResponse } from "../../presentation/shared/Types"
import { LaboratoryMaterial } from "./LaboratoryMaterial"

export interface ILaboratoryMaterialRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_laboratory_room?: number,
    }): Promise<PaginatedResponse<LaboratoryMaterial>>
    createData(data: {
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
    }): Promise<ApiResponse>
    updateData(id: number, data: {
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
    }): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
    importData(file: File): Promise<ApiResponse<{
        imported: number;
        skipped: { row: number; code: string }[];
        failed: { row: number; errors: string[] }[];
    }>>
    downloadTemplate(): Promise<void>
}