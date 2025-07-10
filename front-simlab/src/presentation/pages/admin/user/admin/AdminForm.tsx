import React, { useEffect, useState } from 'react'
import { ApiResponse } from '../../../../../shared/Types'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'

interface FormProps {
    handleSave: (data: any) => Promise<void>
    data: any
    dataId: number | null,
    formId: string
}

const AdminForm: React.FC<FormProps> = ({
    handleSave,
    onClose,
    data,
    dataId,
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (dataId) {
            const adminData = {
                name: data.find((data) => data.id == dataId).name,
                email: data.find((data) => data.id == dataId).email,
                password: null
            }
            setFormData(adminData)
        } else {
            setFormData({})
        }
    }, [dataId, data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            role: 'Admin',
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await handleSave(formData);
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors)
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            
        </>
    )
}

export default AdminForm
