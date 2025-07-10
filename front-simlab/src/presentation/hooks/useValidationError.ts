import { useState } from 'react';

export const useValidationErrors = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const checkValidate = (
        errors: Record<string, string[]>
    ): Record<string, string> => {
        return Object.entries(errors).reduce((acc, [key, value]) => {
            acc[key] = Array.isArray(value) && value.length > 0 ? value[0] : String(value);
            return acc;
        }, {} as Record<string, string>);
    };

    const processErrors = (errorData: Record<string, string[]>) => {
        setErrors(checkValidate(errorData));
    };


    return { errors, setErrors, processErrors };
};
