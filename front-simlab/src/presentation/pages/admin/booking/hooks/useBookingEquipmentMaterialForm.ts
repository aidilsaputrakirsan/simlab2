import { BookingRoomNEquipmentInputDTO } from "@/application/booking/dto/BookingDTO"
import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView"
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView"
import { useCallback, useState } from "react"
import { useAuth } from "@/application/hooks/useAuth"
import { userRole } from "@/domain/User/UserRole"

// Extended type to include price information for UI display
export interface EquipmentMaterialFormItem {
    id: number;
    name: string;
    quantity: number | null;
    unit: string;
    studentPrice?: number;
    lecturerPrice?: number;
    externalPrice?: number;
}

export interface BookingEquipmentMaterialFormData {
    laboratoryEquipments: EquipmentMaterialFormItem[];
    laboratoryMaterials: EquipmentMaterialFormItem[];
}

// Helper function to get user price type
const getUserPriceType = (user: { role: userRole, studyProgram?: any, institution?: any } | null): 'student' | 'lecturer' | 'external' => {
    if (!user) return 'external';
    
    if (user.studyProgram) {
        if (user.role === userRole.Mahasiswa) {
            return 'student';
        }
        return 'lecturer';
    }
    
    return 'external';
};

export const useBookingEquipmentMaterialForm = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<BookingEquipmentMaterialFormData>({
        laboratoryEquipments: [],
        laboratoryMaterials: []
    })

    const priceType = getUserPriceType(user);

    // Get the applicable price based on user type
    const getApplicablePrice = (item: EquipmentMaterialFormItem): number => {
        switch (priceType) {
            case 'student':
                return item.studentPrice ?? 0;
            case 'lecturer':
                return item.lecturerPrice ?? 0;
            case 'external':
                return item.externalPrice ?? 0;
            default:
                return 0;
        }
    };

    // Calculate totals
    const equipmentTotal = formData.laboratoryEquipments.reduce((sum, item) => {
        const price = getApplicablePrice(item);
        return sum + (price * (item.quantity ?? 0));
    }, 0);

    const materialTotal = formData.laboratoryMaterials.reduce((sum, item) => {
        const price = getApplicablePrice(item);
        return sum + (price * (item.quantity ?? 0));
    }, 0);

    const grandTotal = equipmentTotal + materialTotal;

    const handleSelectItem = useCallback((type: 'laboratory_equipment' | 'laboratory_material', data: LaboratoryEquipmentView | LaboratoryMaterialView) => {
        const actionType = type === 'laboratory_equipment' ? 'laboratoryEquipments' : 'laboratoryMaterials';

        setFormData(prev => {
            const exists = prev[actionType].some(eq => eq.id === data.id);
            return {
                ...prev,
                [actionType]: exists
                    ? prev[actionType].filter(eq => eq.id !== data.id)
                    : [
                        ...prev[actionType],
                        {
                            id: data.id,
                            name:
                                type === 'laboratory_equipment'
                                    ? (data as LaboratoryEquipmentView).equipmentName
                                    : (data as LaboratoryMaterialView).materialName,
                            quantity: null,
                            unit: data.unit,
                            studentPrice: data.studentPrice.amount,
                            lecturerPrice: data.lecturerPrice.amount,
                            externalPrice: data.externalPrice.amount,
                        }
                    ]
            }
        })
    }, [])

    const handleChangeItem = useCallback((type: 'laboratory_equipment' | 'laboratory_material', id: number, quantity: number | string | null) => {
        const actionType = type === 'laboratory_equipment' ? 'laboratoryEquipments' : 'laboratoryMaterials';

        // normalize quantity if it's a string (coming from an input event)
        // strip leading zeros when user types numbers like '00' or '012'
        let newValue = quantity;
        if (typeof newValue === 'string' && newValue.length > 1 && newValue.startsWith('0')) {
            newValue = newValue.replace(/^0+/, '');
            if (newValue === '') newValue = '0';
        }

        const parsed = newValue === '' ? null : Number(newValue);
        setFormData(prev => ({
            ...prev,
            [actionType]: prev[actionType].map(eq => eq.id === id ? { ...eq, quantity: parsed } : eq)
        }))
        
    }, [])

    const handleRemoveItem = useCallback((type: 'laboratory_equipment' | 'laboratory_material', id: number) => {
        const actionType = type === 'laboratory_equipment' ? 'laboratoryEquipments' : 'laboratoryMaterials';
        setFormData(prev => ({
            ...prev,
            [actionType]: prev[actionType].filter(eq => eq.id !== id)
        }))
    }, [])

    // Convert form data to DTO format (without price info)
    const getSubmitData = (): BookingRoomNEquipmentInputDTO => ({
        laboratoryEquipments: formData.laboratoryEquipments.map(({ id, name, quantity, unit }) => ({
            id,
            name,
            quantity: quantity ?? 0,
            unit
        })),
        laboratoryMaterials: formData.laboratoryMaterials.map(({ id, name, quantity, unit }) => ({
            id,
            name,
            quantity: quantity ?? 0,
            unit
        }))
    });

    return {
        formData,
        setFormData,
        handleSelectItem,
        handleChangeItem,
        handleRemoveItem,
        getSubmitData,
        priceType,
        getApplicablePrice,
        equipmentTotal,
        materialTotal,
        grandTotal,
    }
}
