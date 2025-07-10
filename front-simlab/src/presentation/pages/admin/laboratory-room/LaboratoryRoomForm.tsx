import React, { useEffect, useState } from 'react'
import { ApiResponse } from '../../../../shared/Types'
import { User } from '../../../../domain/User/User'

interface FormProps {
    handleSave: (data: any) => Promise<void>
    onClose: () => void,
    laboranData: User[]
    data: any
    dataId: number | null,
}

const LaboratoryRoomForm: React.FC<FormProps> = ({
    handleSave,
    onClose,
    laboranData,
    data,
    dataId,
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data) => data.id == dataId)
            setFormData({
                name: selectedData.name,
                floor: selectedData.floor,
                user_id: selectedData.userId
            })
        } else {
            setFormData({})
        }

    }, [dataId])

    const handleChange = (e: React.ChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const checkValidate = (errors: Record<string, string[]>) => {
        const newErrors: Record<string, string> = Object.entries(errors).reduce(
            (acc, [key, value]) => ({
                ...acc,
                [key]: Array.isArray(value) && value.length > 0 ? value[0] : value as unknown as string
            }),
            {}
        );

        setErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await handleSave(formData);
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                checkValidate(error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='name'>
                        Nama Ruangan <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData['name'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='Nama Ruangan'
                    />
                    {errors['name'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='floor'>
                        Ruangan <span className="text-red-500">*</span>
                    </label>
                    <select
                        id='floor'
                        name='floor'
                        value={formData['floor'] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border border-gray-300 rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">
                            -- Pilih Lantai --
                        </option>
                        <option value="Lantai 1">
                            Lantai 1
                        </option>
                        <option value="Lantai 2">
                            Lantai 2
                        </option>
                        <option value="Lantai 3">
                            Lantai 3
                        </option>
                    </select>
                    {errors['floor'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['floor']}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='user'>
                        Petugas Laboran <span className="text-red-500">*</span>
                    </label>
                    <select
                        id='user_id'
                        name='user_id'
                        value={formData['user_id'] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border border-gray-300 rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">
                            -- Pilih Laboran --
                        </option>
                        {laboranData?.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    {errors['user_id'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['user_id']}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-200 border-solid rounded-b">
                    <button
                        type="button"
                        className="px-6 py-2 mb-1 mr-2 text-sm font-bold text-gray-500 outline-none background-transparent focus:outline-none"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-6 py-2 mb-1 mr-1 text-sm font-bold text-white bg-blue-500 rounded shadow outline-none hover:shadow-lg focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'active:bg-blue-600'}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </>
    )
}

export default LaboratoryRoomForm