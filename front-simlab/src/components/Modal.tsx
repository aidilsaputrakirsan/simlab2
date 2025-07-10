import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api/ApiClient';
import { TahunAkademik } from '../types/TahunAkademik';

// Generic field definition
interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date';
    placeholder?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
    validator?: (value: any) => string | null;
}

// Props for the universal modal
interface UniversalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    data: any | null;
    title: string;
    fields: FieldConfig[];
    apiEndpoint?: string;
    modalType: 'Add' | 'Edit',

    dataId: number | null
}

const UniversalModal: React.FC<UniversalModalProps> = ({
    isOpen,
    onClose,
    onSave,
    data,
    title,
    fields,
    apiEndpoint,
    modalType,
    dataId
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form data based on fields config
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);

            const initialData: Record<string, any> = {};
            const initialErrors: Record<string, string> = {};

            // Initialize each field with default or existing value
            if (modalType === 'Edit') {
                const selectedData = data.find((d:TahunAkademik) => d.id === dataId)
                
                if (selectedData) {
                    fields.forEach(field => {                        
                        if (selectedData && selectedData[field.name] !== undefined) {
                            initialData[field.name] = selectedData[field.name];
                        } else {
                            // Otherwise use default values based on field type
                            initialData[field.name] = field.type === 'select' && field.options?.length
                                ? field.options[0].value
                                : '';
                        }
                        initialErrors[field.name] = '';
                    });
                }
            }

            setFormData(initialData);
            setErrors(initialErrors);
            setIsLoading(false);
            // console.log(initialData);
            
        }
    }, [data, fields, isOpen]);

    // Local validation
    const validateForm = async () => {
        let isValid = true;
        const newErrors: Record<string, string> = {};

        // // Perform local validation
        // for (const field of fields) {
        //     newErrors[field.name] = '';

        //     // Required field validation
        //     if (field.required && !formData[field.name]?.toString().trim()) {
        //         newErrors[field.name] = `${field.label} is required`;
        //         isValid = false;
        //     }

        //     // Custom field validation if provided
        //     if (isValid && field.validator && formData[field.name]) {
        //         const validationError = field.validator(formData[field.name]);
        //         if (validationError) {
        //             newErrors[field.name] = validationError;
        //             isValid = false;
        //         }
        //     }
        // }

        // API validation if endpoint is provided
        if (isValid && apiEndpoint) {
            const response = await fetchApi(`${apiEndpoint}/validate/${dataId}`, {
                method: 'POST',
                body: JSON.stringify({
                    id: data?.id, // Include ID for update operations
                    ...formData
                }),
                token: localStorage.getItem('token') as string
            });

            if (response) {
                const errorData = response;

                // Handle Laravel validation response format
                // Laravel returns: { errors: { field_name: [Array of error messages] } }
                if (errorData.errors) {
                    Object.keys(errorData.errors).forEach(key => {
                        // Convert Laravel's snake_case to camelCase if needed

                        if (!newErrors.hasOwnProperty(key)) {
                            // Laravel returns an array of error messages per field
                            // We'll use the first one for simplicity
                            newErrors[key] = Array.isArray(errorData.errors[key])
                                ? errorData.errors[key][0]
                                : errorData.errors[key];
                            isValid = false;
                        }
                    });
                } else if (errorData.message) {
                    // General error message
                    alert(errorData.message);
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const isValid = await validateForm();
            if (isValid) {
                onSave(formData);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render field based on type
    const renderField = (field: FieldConfig) => {
        const { name, label, type, placeholder, options, required } = field;

        switch (type) {
            case 'select':
                return (
                    <select
                        id={name}
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border border-gray-300 rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    // required={required}
                    >
                        {options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        id={name}
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder={placeholder}
                    // required={required}
                    />
                );

            default:
                return (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder={placeholder}
                    // required={required}
                    />
                );
        }
    };

    return (
        <div className={`fixed inset-0 z-[99] flex items-center justify-center overflow-x-hidden overflow-y-auto transition-all bg-black bg-opacity-50 outline-none focus:outline-none ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}>
            <div className="relative w-full max-w-md mx-auto my-6">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-gray-200 border-solid rounded-t">
                        <h3 className="text-lg font-semibold">
                            {data ? `Edit ${title}` : `Add ${title}`}
                        </h3>
                        <button
                            className="float-right p-1 ml-auto text-2xl font-semibold leading-none text-gray-400 bg-transparent border-0 outline-none hover:text-gray-600 focus:outline-none"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            <span className="block w-6 h-6 text-xl text-gray-500 bg-transparent outline-none focus:outline-none">
                                ×
                            </span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative flex-auto p-6 max-h-[70vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <svg className="w-8 h-8 mr-2 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading data...</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {fields.map(field => (
                                    <div className="mb-4" key={field.name}>
                                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor={field.name}>
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {renderField(field)}
                                        {errors[field.name] && (
                                            <p className="mt-1 text-xs italic text-red-500">{errors[field.name]}</p>
                                        )}
                                    </div>
                                ))}

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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversalModal;