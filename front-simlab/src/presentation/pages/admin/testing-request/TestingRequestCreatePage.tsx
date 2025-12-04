import { useAuth } from '@/application/hooks/useAuth';
import FormGroup from '@/presentation/components/custom/FormGroup';
import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Button } from '@/presentation/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';
import { useTestingRequestForm } from './hooks/useTestingRequestForm';
import SingleDatetimePicker from '@/presentation/components/custom/SingleDateTimePicker';
import { Textarea } from '@/presentation/components/ui/textarea';
import { useTestingTypeSelect } from '../testing-type/hooks/useTestingTypeSelect';
import { Combobox } from '@/presentation/components/custom/combobox';

const TestingRequestCreatePage = () => {
    const { user } = useAuth()

    const {
        formData,
        setFormData,
        handleChange,
        handleDateTimeChange,
        handleTestingItemChange,
        handleAddTestingItem,
        handleRemoveTestingItem
    } = useTestingRequestForm()

    const { testingTypes } = useTestingTypeSelect()

    return (
        <>
            <Header title='Menu Pengujian' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Ajukan Pengujian</CardTitle>
                        <CardAction>
                            <NavLink to={'/panel/pengujian'}>
                                <Button>
                                    Kembali
                                    <ArrowLeft />
                                </Button>
                            </NavLink>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <form className='grid md:grid-cols-2 gap-x-5 gap-y-4'>
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
                                label='Nomor Identitas Peminjam'
                                required>
                                <Input
                                    type='text'
                                    value={user?.identityNum}
                                    placeholder='User'
                                    disabled={true}
                                />
                            </FormGroup>
                            <FormGroup
                                className='md:col-span-2'
                                id='name'
                                label='Program Studi'
                                required>
                                <Input
                                    type='text'
                                    value={user?.studyProgram?.name}
                                    placeholder='User'
                                    disabled={true}
                                />
                            </FormGroup>
                            <FormGroup
                                id='phone_number'
                                label='Nomor Hp (Whatsapp)'
                                required>
                                <Input
                                    type='text'
                                    id='phone_number'
                                    name='phone_number'
                                    onChange={handleChange}
                                    placeholder='Nomor Hp'
                                />
                            </FormGroup>
                            <FormGroup
                                id='activity_name'
                                label='Judul Proyek / Penelitian'
                                required>
                                <Input
                                    type='text'
                                    id='activity_name'
                                    name='activity_name'
                                    onChange={handleChange}
                                    placeholder='Judul Proyek / Penelitian'
                                />
                            </FormGroup>
                            <FormGroup
                                id='supervisor'
                                label='Dosen Pembimbing'
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
                                required>
                                <Input
                                    type='text'
                                    id='supervisor_email'
                                    name='supervisor_email'
                                    onChange={handleChange}
                                    placeholder='Email Dosen Pembimbing'
                                />
                            </FormGroup>
                            <FormGroup
                                className='md:col-span-2'
                                id='testing_time'
                                label='Tanggal Pengujian'
                                required>
                                <SingleDatetimePicker
                                    current_time={formData.testing_time}
                                    name='testing_time'
                                    onChange={handleDateTimeChange} />
                            </FormGroup>
                            <div className='md:col-span-2 flex flex-col gap-5'>
                                <Button type={'button'} onClick={handleAddTestingItem} size={'sm'} className='w-fit'>Tambah Pengujian <Plus /></Button>
                                {formData.testing_items.map((item, idx) => (
                                    <div className='gap-x-5 gap-y-4 flex items-end' key={idx}>
                                        <FormGroup
                                            className='w-full'
                                            id='testing_type_id'
                                            label='Jenis Pengujian'
                                            required>
                                            <Combobox
                                                options={testingTypes}
                                                value={item.testing_type_id?.toString() || ''}
                                                onChange={(val) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        testing_items: prev.testing_items.map((itm, i) =>
                                                            i === idx ? { ...itm, testing_type_id: Number(val) } : itm
                                                        )
                                                    }))
                                                }}
                                                placeholder="Pilih Jenis Pengujian"
                                                optionLabelKey='name'
                                                optionValueKey='id'
                                            />
                                        </FormGroup>
                                        <FormGroup
                                            className='w-full'
                                            id='quantity'
                                            label='Quantity'
                                            required>
                                            <Input
                                                type='number'
                                                value={item.quantity ?? ''}
                                                id='quantity'
                                                name='quantity'
                                                onChange={(e) => handleTestingItemChange(e, idx)}
                                                placeholder='Email Dosen Pembimbing'
                                            />
                                        </FormGroup>
                                        { formData.testing_items.length > 1 && (
                                            <Button type={'button'} onClick={() => handleRemoveTestingItem(idx)} variant={'destructive'} size={'sm'}><Trash /></Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <FormGroup
                                className='md:col-span-2'
                                id='information'
                                label='Keterangan'
                                required>
                                <Textarea
                                    name="information"
                                    id="information"
                                    onChange={handleChange}
                                    placeholder='Keterangan'
                                >
                                </Textarea>
                            </FormGroup>

                            {/* <div className='md:col-span-2 flex justify-end'>
                                <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
                            </div> */}
                        </form>
                    </CardContent>
                </Card>
            </MainContent>
        </>
    )
}

export default TestingRequestCreatePage