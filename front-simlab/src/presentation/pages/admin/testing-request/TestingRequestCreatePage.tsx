import { useAuth } from '@/application/hooks/useAuth';
import FormGroup from '@/presentation/components/custom/FormGroup';
import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Button } from '@/presentation/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useTestingRequestForm } from './hooks/useTestingRequestForm';
import SingleDatetimePicker from '@/presentation/components/custom/SingleDateTimePicker';
import { Textarea } from '@/presentation/components/ui/textarea';
import { useTestingTypeSelect } from '../testing-type/hooks/useTestingTypeSelect';
import { Combobox } from '@/presentation/components/custom/combobox';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { toast } from 'sonner';
import { ApiResponse } from '@/presentation/shared/Types';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import { MoneyView } from '@/application/money/MoneyView';
import { userRole } from '@/domain/User/UserRole';

const TestingRequestCreatePage = () => {
    const { user } = useAuth()
    const { testingRequestService } = useDepedencies()

    const {
        formData,
        setFormData,
        handleChange,
        handleDateTimeChange,
        handleTestingItemChange,
        handleAddTestingItem,
        handleRemoveTestingItem
    } = useTestingRequestForm()

    const totalAll = formData.testing_items.reduce((sum, item) => {
        if (!item.price || !item.quantity) return sum;
        return sum + item.price * item.quantity;
    }, 0);

    const { errors, setErrors, processErrors } = useValidationErrors()
    const { testingTypes } = useTestingTypeSelect()
    const navigate = useNavigate();

    const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
    const handleSubmit = async () => {
        setErrors({})

        try {
            const res = await testingRequestService.createData(formData)
            toast.success(res.message)
            navigate(`/panel/pengujian/`)
        } catch (e) {
            const error = e as ApiResponse
            toast.error(error.message)
            if (error.errors) {
                processErrors(error.errors)
            }
        } finally {
            setIsConfirmationOpen(false)
        }
    }

    return (
        <>
            <Header title='Menu Pengujian' />
            <MainContent>
                <div className='flex flex-col gap-4'>
                    <Card className='h-fit'>
                        <CardHeader>
                            <CardTitle>Ajukan Pengujian</CardTitle>
                            <CardAction>
                                <NavLink to={'/panel/pengujian'}>
                                    <Button type='button'>
                                        Kembali
                                        <ArrowLeft />
                                    </Button>
                                </NavLink>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className='grid md:grid-cols-2 gap-x-5 gap-y-4'>
                                <FormGroup
                                    id='name'
                                    label='Nama Pemohon'
                                    required>
                                    <Input
                                        type='text'
                                        value={user?.name}
                                        placeholder='User'
                                        disabled={true}
                                    />
                                </FormGroup>
                                <FormGroup
                                    id='name'
                                    label='Nomor Identitas Pemohon'
                                    required>
                                    <Input
                                        type='text'
                                        value={user?.identityNum}
                                        placeholder='User'
                                        disabled={true}
                                    />
                                </FormGroup>
                                {user?.studyProgram && (
                                    <FormGroup
                                        className='md:col-span-2'
                                        id='name'
                                        label='Program Studi'
                                        required>
                                        <Input
                                            type='text'
                                            value={user?.studyProgram?.name}
                                            placeholder='-'
                                            disabled={true}
                                        />
                                    </FormGroup>
                                )}
                                {user?.institution && (
                                    <FormGroup
                                        className='md:col-span-2'
                                        id='name'
                                        label='Asal Institusi'
                                        required>
                                        <Input
                                            type='text'
                                            value={user?.institution?.name}
                                            placeholder='-'
                                            disabled={true}
                                        />
                                    </FormGroup>
                                )}
                                <FormGroup
                                    id='phone_number'
                                    label='Nomor Hp (Whatsapp)'
                                    error={errors['phone_number']}
                                    required>
                                    <Input
                                        type='text'
                                        id='phone_number'
                                        name='phone_number'
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder='Nomor Hp'
                                    />
                                </FormGroup>
                                <FormGroup
                                    id='activity_name'
                                    label='Judul Proyek / Penelitian'
                                    error={errors['activity_name']}
                                    required>
                                    <Input
                                        type='text'
                                        id='activity_name'
                                        value={formData.activity_name}
                                        name='activity_name'
                                        onChange={handleChange}
                                        placeholder='Judul Proyek / Penelitian'
                                    />
                                </FormGroup>
                                {user?.role === userRole.Mahasiswa && (
                                    <>
                                        <FormGroup
                                            id='supervisor'
                                            label='Dosen Pembimbing'
                                            error={errors['supervisor']}
                                            required>
                                            <Input
                                                type='text'
                                                id='supervisor'
                                                name='supervisor'
                                                onChange={handleChange}
                                                placeholder='Dosen Pembimbing'
                                            />
                                        </FormGroup>
                                        <FormGroup
                                            id='supervisor_email'
                                            label='Email Dosen Pembimbing'
                                            error={errors['supervisor_email']}
                                            required>
                                            <Input
                                                type='text'
                                                id='supervisor_email'
                                                name='supervisor_email'
                                                onChange={handleChange}
                                                placeholder='Email Dosen Pembimbing'
                                            />
                                        </FormGroup>
                                    </>
                                )}
                                <FormGroup
                                    className='md:col-span-2'
                                    id='testing_time'
                                    label='Tanggal Pengujian'
                                    error={errors['testing_time']}
                                    required>
                                    <SingleDatetimePicker
                                        current_time={formData.testing_time}
                                        name='testing_time'
                                        onChange={handleDateTimeChange} />
                                </FormGroup>
                                <FormGroup
                                    className='md:col-span-2'
                                    id='information'
                                    label='Keterangan'
                                    error={errors['information']}
                                    required>
                                    <Textarea
                                        name="information"
                                        id="information"
                                        onChange={handleChange}
                                        placeholder='Keterangan'
                                    >
                                    </Textarea>
                                </FormGroup>

                            </div>
                        </CardContent>
                    </Card>
                    <Card className='h-fit'>
                        <CardHeader>
                            <CardTitle>Daftar Pengujian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col gap-5'>
                                <Button type={'button'} onClick={handleAddTestingItem} size={'sm'} className='w-fit'>Tambah Pengujian <Plus /></Button>
                                {formData.testing_items.map((item, idx) => (
                                    <div className='gap-x-5 gap-y-4 flex flex-col items-start md:grid md:grid-cols-2 xl:flex xl:flex-row' key={idx}>
                                        <FormGroup
                                            className='w-full'
                                            id='testing_type_id'
                                            label='Jenis Pengujian'
                                            error={errors[`testing_items.${idx}.testing_type_id`]}
                                            required>
                                            <Combobox
                                                options={testingTypes}
                                                value={item.testing_type_id?.toString() || ''}
                                                onChange={(val) => {
                                                    const selecteTestingType = testingTypes.find((data) => data.id === Number(val))
                                                    if (selecteTestingType) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            testing_items: prev.testing_items.map((itm, i) =>
                                                                i === idx ? { ...itm, testing_type_id: selecteTestingType.id, price: selecteTestingType.price.amount, unit: selecteTestingType.unit, name: selecteTestingType.name } : itm
                                                            )
                                                        }))
                                                    }
                                                }}
                                                placeholder="Pilih Jenis Pengujian"
                                                optionLabelKey='name'
                                                optionValueKey='id'
                                            />
                                        </FormGroup>
                                        <FormGroup
                                            className='w-full'
                                            id='quantity'
                                            label={`Kuantitas Pengujian ${item.testing_type_id ? '(per/' + item.unit + ')' : ''}`}
                                            error={errors[`testing_items.${idx}.quantity`]}
                                            required>
                                            <Input
                                                type='number'
                                                value={item.quantity ?? ''}
                                                id='quantity'
                                                name='quantity'
                                                onChange={(e) => handleTestingItemChange(e, idx)}
                                                placeholder='Kuantitas Pengujian'
                                            />
                                        </FormGroup>
                                        <FormGroup
                                            className='w-full'
                                            id='price'
                                            label={`Tarif Pengujian`}
                                            required>
                                            <Input
                                                type='text'
                                                value={item.price != null
                                                    ? MoneyView.toViewModel(item.price).formatToIDR() + '/' + item.unit
                                                    : ''}
                                                id='price'
                                                name='price'
                                                placeholder='Tarif Pengujian'
                                                disabled
                                            />
                                        </FormGroup>
                                        <FormGroup
                                            className='w-full'
                                            id='quantity'
                                            label={`Total Tarif`}
                                            required>
                                            <Input
                                                type='text'
                                                value={item.price && item.quantity
                                                    ? MoneyView.toViewModel(item.price).multiply(item.quantity).formatToIDR()
                                                    : ''}
                                                id='quantity'
                                                name='quantity'
                                                placeholder='Total Tarif'
                                                disabled
                                            />
                                        </FormGroup>
                                        {formData.testing_items.length > 1 && (
                                            <Button type={'button'} className='w-full xl:w-fit md:col-span-2' onClick={() => handleRemoveTestingItem(idx)} variant={'destructive'} size={'sm'}><Trash /></Button>
                                        )}
                                    </div>
                                ))}
                                <FormGroup
                                    className='self-end'
                                    id='quantity'
                                    label={`Total`}
                                    required>
                                    <Input
                                        id='quantity'
                                        value={MoneyView.toViewModel(totalAll).formatToIDR()}
                                        name='quantity'
                                        placeholder='Total Tarif'
                                        disabled
                                    />
                                </FormGroup>
                            </div>
                        </CardContent>
                    </Card>

                    <div className='xl:col-span-3 flex justify-end'>

                        <Button type='submit' onClick={() => setIsConfirmationOpen(true)} >Simpan</Button>
                        <ConfirmationDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen} onConfirm={handleSubmit} />
                    </div>
                </div>
            </MainContent>
        </>
    )
}

export default TestingRequestCreatePage