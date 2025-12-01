import React from 'react'
import { Label } from '../ui/label'

interface FormGroupProps {
    children: React.ReactNode,
    id: string,
    label: string,
    error?: string,
    required?: boolean,
    className?: string
}

const FormGroup: React.FC<FormGroupProps> = ({
    children,
    id,
    label,
    error,
    required,
    className
}) => {
    return (
        <div className={className}>
            <div className='flex flex-col gap-2'>
                <Label htmlFor={id}>
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
                {children}
            </div>

            {error && (
                <p className="mt-1 text-xs italic text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}

export default FormGroup