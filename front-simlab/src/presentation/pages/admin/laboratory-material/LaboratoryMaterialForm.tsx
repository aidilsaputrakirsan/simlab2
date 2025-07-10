import React, { useEffect, useRef, useState } from 'react'
import { ApiResponse } from '../../../../shared/Types'
import { LaboratoryRoom } from '../../../../domain/laboratory-room/LaboratoryRoom'

interface FormProps {
    handleSave: (data: any) => Promise<void>
    onClose: () => void
    ruanganLaboratoriumData: LaboratoryRoom[]
    data: any
    dataId: number | null,
}

const LaboratoryMaterialForm: React.FC<FormProps> = ({
    handleSave,
    onClose,
    data,
    ruanganLaboratoriumData,
    dataId,
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        setErrors({})
        if (formRef.current) {
            formRef.current.reset(); // Resets all native input elements including files
        }

        if (dataId) {
            const selectedData = data.find((data) => data.id == dataId)
            setFormData({
                code: selectedData.code,
                ruangan_laboratorium_id: selectedData.ruanganLaboratoriumId,
                material_name: selectedData.materialName,
                brand: selectedData.brand,
                stock: selectedData.stock,
                unit: selectedData.unit,
                purchase_date: selectedData.purchaseDate,
                expiry_date: selectedData.expiryDate,
                description: selectedData.description,
                refill_date: selectedData.refillDate
            })

            // reset photo state value to pass nullable validation
            setFormData((prev) => ({ ...prev, photo: null }));
        } else {
            setFormData({})
        }
    }, [dataId])

    const handleChange = (e: React.ChangeEvent) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
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
            <form onSubmit={handleSubmit} className='grid md:grid-cols-2 gap-x-5 gap-y-2' encType="multipart/form-data" ref={formRef}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Kode Bahan <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='text'
                        id='code'
                        name='code'
                        value={formData['code'] || ''}
                        onChange={dataId ? undefined : handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300`}
                        placeholder='Kode Bahan'
                        disabled={dataId ? true : false}
                    />
                    {errors['code'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['code']}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Nama Bahan <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='text'
                        id='material_name'
                        name='material_name'
                        value={formData['material_name'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='Nama Bahan'
                    />
                    {errors['material_name'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['material_name']}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Merek Bahan
                    </label>
                    <input
                        type='text'
                        id='brand'
                        name='brand'
                        value={formData['brand'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='Merek Bahan'
                    />
                    {errors['brand'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['brand']}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Stok Bahan <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='number'
                        id='stock'
                        name='stock'
                        value={formData['stock'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='0'
                    />
                    {errors['stock'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['stock']}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Satuan Bahan <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='text'
                        id='unit'
                        name='unit'
                        value={formData['unit'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='Satuan Bahan'
                    />
                    {errors['unit'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['unit']}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Lokasi Alat <span className="text-red-500">*</span>
                    </label>
                    <select
                        id='ruangan_laboratorium_id'
                        name='ruangan_laboratorium_id'
                        value={formData['ruangan_laboratorium_id'] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border border-gray-300 rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">
                            -- Pilh Lokasi --
                        </option>
                        {ruanganLaboratoriumData?.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    {errors['ruangan_laboratorium_id'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['ruangan_laboratorium_id']}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Tanggal Beli Bahan <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='date'
                        id='purchase_date'
                        name='purchase_date'
                        value={formData['purchase_date'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors['purchase_date'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['purchase_date']}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Tanggal Kadaluarsa Bahan
                    </label>
                    <input
                        type='date'
                        id='expiry_date'
                        name='expiry_date'
                        value={formData['expiry_date'] || ''}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors['expiry_date'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['expiry_date']}</p>
                    )}
                </div>

                <div className="mb-4 md:col-span-2">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                        Keterangan Bahan
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder='Keterangan'
                        value={formData['description'] || ''}
                    >
                    </textarea>
                    {errors['description'] && (
                        <p className="mt-1 text-xs italic text-red-500">{errors['description']}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-200 border-solid rounded-b md:col-span-2">
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

export default LaboratoryMaterialForm
