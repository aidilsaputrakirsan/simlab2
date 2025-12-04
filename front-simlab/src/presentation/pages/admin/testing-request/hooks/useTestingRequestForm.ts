import { TestingRequestInputDTO } from "@/application/testing-request/TestingRequestDTO"
import { useState } from "react"

export const useTestingRequestForm = () => {
    const [formData, setFormData] = useState<TestingRequestInputDTO>({
        phone_number: '',
        activity_name: '',
        supervisor: null,
        supervisor_email: null,
        testing_time: undefined,
        information: '',
        testing_items: [
            {
                testing_type_id: null,
                quantity: null
            }
        ]
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateTimeChange = (e: { target: { name: string; value: Date } }) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTestingItemChange = (e: React.ChangeEvent<HTMLInputElement>, testingTypeId: number) => {
        const { type, name, value } = e.target;

        let newValue = value;
        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }
        setFormData(prev => ({
            ...prev,
            testing_items: prev.testing_items.map((cls, idx) =>
                idx === testingTypeId ? { ...cls, [name]: newValue } : cls
            )
        }));
    };

    const handleAddTestingItem = () => {
        const newTestingItem = {
            testing_type_id: null,
            quantity: null
        }

        setFormData(prev => ({
            ...prev,
            testing_items: [...prev.testing_items, newTestingItem]
        }))
    }

    const handleRemoveTestingItem = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            testing_items: prev.testing_items.filter((_, i) => i !== idx)
        }))
    }

    return {
        formData,
        setFormData,
        handleChange,
        handleDateTimeChange,
        handleTestingItemChange,
        handleAddTestingItem,
        handleRemoveTestingItem
    }
}