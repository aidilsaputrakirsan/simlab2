import Header from '@/presentation/components/Header'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '@/application/hooks/useAuth';
import { Input } from '@/presentation/components/ui/input';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/presentation/shared/Types';
import BookingDateTimeRangePicker from '@/presentation/components/custom/BookingDateTimePicker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { toast } from 'sonner';
import { Textarea } from '@/presentation/components/ui/textarea';
import { BookingType } from '@/domain/booking/BookingType';
import { Combobox } from '@/presentation/components/custom/combobox';
import { useLaboratoryRoomSelect } from '../laboratory-room/hooks/useLaboratoryRoomSelect';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useBooking } from './context/BookingContext';
import { useBookingForm } from './hooks/useBookingForm';
import FormGroup from '@/presentation/components/custom/FormGroup';
import { userRole } from '@/domain/User/UserRole';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import { Alert, AlertDescription, AlertTitle } from '@/presentation/components/ui/alert';

// Helper function to get user price type
const getUserPriceType = (user: { role: userRole, studyProgram?: any, institution?: any } | null): 'student' | 'lecturer' | 'external' => {
  if (!user) return 'external';
  
  if (user.studyProgram) {
    // Internal user (has study program)
    if (user.role === userRole.Mahasiswa) {
      return 'student';
    }
    return 'lecturer'; // Dosen or other internal roles
  }
  
  // External user (has institution or no study program)
  return 'external';
};

// Helper function to format price to IDR
const formatPriceToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(amount);
};

const BookingCreatePage = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const tl = gsap.timeline()
    tl.fromTo(sectionRef.current,
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 1
      },
    )
  }, [])

  const { user } = useAuth()
  const { laboratoryRooms } = useLaboratoryRoomSelect()
  const { bookingService } = useDepedencies()
  const { isHasDraftBooking, refreshIsHasDraftBooking } = useBooking()

  const {
    formData,
    setFormData,
    handleChange,
    handleDateTimeChange
  } = useBookingForm()

  const { errors, processErrors, setErrors } = useValidationErrors()
  const navigate = useNavigate();

  // Calculate selected room price based on user type
  const selectedRoomPrice = useMemo(() => {
    if (!formData.laboratory_room_id) return null;
    
    const selectedRoom = laboratoryRooms.find(room => room.id === formData.laboratory_room_id);
    if (!selectedRoom) return null;

    const priceType = getUserPriceType(user);
    
    switch (priceType) {
      case 'student':
        return { amount: selectedRoom.studentPrice.amount, label: 'Harga Mahasiswa' };
      case 'lecturer':
        return { amount: selectedRoom.lecturerPrice.amount, label: 'Harga Dosen/Internal' };
      case 'external':
        return { amount: selectedRoom.externalPrice.amount, label: 'Harga Pihak Luar' };
      default:
        return null;
    }
  }, [formData.laboratory_room_id, laboratoryRooms, user]);

  useEffect(() => {
    if (isHasDraftBooking) {
      navigate('/404')
    }
  }, [isHasDraftBooking])


  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const handleSubmit = async () => {
    setErrors({})
    try {
      const res = await bookingService.createData(formData);
      toast.success(res.message)
      if (res.data?.bookingType === BookingType.Room) {
        navigate(`/panel/peminjaman/`)
      } else {
        navigate(`/panel/peminjaman/${res.data?.id}/manage`)
      }
      refreshIsHasDraftBooking()
    } catch (e) {
      const error = e as ApiResponse
      toast.error(error.message)
      if (error.errors) {
        processErrors(error.errors);
      }
      setIsConfirmationOpen(false)
    }
  }

  return (
    <>
      <Header title="Menu Peminjaman" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
        <Card>
          <CardHeader>
            <CardTitle>Ajukan Peminjaman</CardTitle>
            <CardAction>
              <NavLink to={'/panel/peminjaman'}>
                <Button>
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
                  placeholder='-'
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
                  onChange={handleChange}
                  placeholder='Nomor Hp'
                />
              </FormGroup>
              <FormGroup
                id='purpose'
                label='Tujuan Peminjaman'
                error={errors['purpose']}
                required>
                <Input
                  type='text'
                  id='purpose'
                  name='purpose'
                  onChange={handleChange}
                  placeholder='Tujuan Peminjaman'
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
                  name='activity_name'
                  onChange={handleChange}
                  placeholder='Judul Proyek / Penelitian'
                />
              </FormGroup>
              <FormGroup
                id='supporting_file'
                label='Surat Pengantar / Berkas Pendukung'
                error={errors['supporting_file']}>
                <Input
                  type='file'
                  id='supporting_file'
                  name='supporting_file'
                  accept='.doc,.docx,.pdf'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size > 2 * 1024 * 1024) {
                      toast.error('Ukuran file tidak boleh melebihi 2MB');
                      e.target.value = '';
                      return;
                    }
                    handleChange(e);
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">Format: PDF, DOC, DOCX. Maksimal 2MB.</p>
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
                id=''
                label='Tanggal & Waktu'
                error={errors['end_time']}
                required>
                <BookingDateTimeRangePicker
                  startDateTime={formData.start_time}
                  endDateTime={formData.end_time}
                  onChange={handleDateTimeChange} />
              </FormGroup>
              {(formData['booking_type'] === 'room' || formData['booking_type'] === 'room_n_equipment') && (
                <FormGroup
                  className='md:col-span-2'
                  id='laboratory_room_id'
                  label='Ruangan'
                  error={errors['laboratory_room_id']}
                  required>
                  <Combobox
                    options={laboratoryRooms}
                    value={formData.laboratory_room_id?.toString() || ''}
                    onChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        laboratory_room_id: val ? Number(val) : null
                      }))
                    }}
                    placeholder="Pilih ruangan"
                    optionLabelKey='name'
                    optionValueKey='id'
                  />
                  {/* Display room price based on user type */}
                  {selectedRoomPrice && selectedRoomPrice.amount > 0 && (
                    <Alert className="mt-2">
                      <Info className="h-4 w-4" />
                      <AlertTitle>{selectedRoomPrice.label}</AlertTitle>
                      <AlertDescription className="text-primary font-semibold">
                        {formatPriceToIDR(selectedRoomPrice.amount)}
                      </AlertDescription>
                    </Alert>
                  )}
                </FormGroup>
              )}
              <FormGroup
                id='booking_type'
                label='Jenis Peminjaman'
                error={errors['booking_type']}
                required>
                <Select
                  name='booking_type'
                  value={formData['booking_type']}
                  onValueChange={(value) =>
                    handleChange({
                      target: {
                        name: 'booking_type',
                        value: value
                      }
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis Peminjaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Jenis Peminjaman</SelectLabel>
                      <SelectItem value='room'>Peminjaman Ruangan</SelectItem>
                      <SelectItem value='room_n_equipment'>Peminjaman Ruangan dan Alat</SelectItem>
                      <SelectItem value='equipment'>Peminjaman Alat</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormGroup>
              <FormGroup
                id='total_participant'
                label='Jumlah Partisipan'
                error={errors['total_participant']}
                required>
                <Input
                  type='number'
                  id='total_participant'
                  name='total_participant'
                  onChange={handleChange}
                  placeholder='0'
                />
              </FormGroup>
              <FormGroup
                className='md:col-span-2'
                id='participant_list'
                label='Jumlah Partisipan'
                error={errors['participant_list']}
                required>
                <Textarea
                  name="participant_list"
                  id="participant_list"
                  onChange={handleChange}
                  placeholder='1. Nama'
                >
                </Textarea>
              </FormGroup>

              <div className='md:col-span-2 flex justify-end'>
                <Button type='button' onClick={() => setIsConfirmationOpen(true)}>Simpan & Lanjutkan</Button>
                <ConfirmationDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen} onConfirm={handleSubmit} confirmLabel='Simpan & Lanjutkan' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BookingCreatePage
