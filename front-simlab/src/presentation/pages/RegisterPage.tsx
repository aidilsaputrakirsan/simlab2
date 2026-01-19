import { useEffect, useState } from "react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/hooks/useAuth";
import { useValidationErrors } from "../hooks/useValidationError";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Combobox } from "../components/custom/combobox";
import { ApiResponse } from "@/presentation/shared/Types";
import ItkLogo from '../assets/itk_logo.png'
import { RegisterDTO } from "@/application/auth/AuthDTO";
import FormGroup from "../components/custom/FormGroup";
import PasswordInput from "../components/custom/PasswordInput";
import { useStudyProgramSelect } from "./admin/study-program/hooks/useStudyProgramSelect";
import { useInstitutionSelect } from "./admin/institution/hooks/useInstitutionSelect";
import { Checkbox } from "../components/ui/checkbox";

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterDTO>({
        name: '',
        identity_num: '',
        role: '',
        study_program_id: null,
        institution_id: null,
        institution: '',
        email: '',
        password: '',
        c_password: ''
    });
    const { errors, processErrors, setErrors } = useValidationErrors()
    const [isLoading, setIsLoading] = useState(false);
    const { studyPrograms } = useStudyProgramSelect()
    const { institutions } = useInstitutionSelect()
    const { user, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isNotRegisteredInstitution, setIsNotRegisteredInstitution] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({})
        try {
            await register(formData);
            navigate('/login');
            toast.success('Berhasil mendaftar, silahkan login!')
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors)
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            institution_id: null,
            institution: ''
        }))
    }, [formData.role])

    useEffect(() => {
        if (isNotRegisteredInstitution) {
            setFormData((prev) => ({
                ...prev,
                institution_id: null,
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                institution: '',
            }))
        }
    }, [isNotRegisteredInstitution])

    if (user) {
        return <Navigate to="/panel" state={{ from: location }} replace />;
    }

    return (
        <>
            <div className="grid min-h-screen bg-white md:grid-cols-2 xl:grid-cols-9">
                <div className="flex flex-col items-center w-full px-5 py-10 space-y-8 sm:px-10 md:px-10 xl:px-16 h-fit xl:col-span-4">
                    <img src={ItkLogo} className="w-36" alt="" />
                    <div className="w-full text-left">
                        <h3 className="text-3xl font-medium">Pendaftaran Akun</h3>
                        <h4 className="text-base">Daftar akun untuk mengakases SIMLAB!</h4>
                    </div>
                    <form className="grid w-full grid-cols-1 mt-8 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                        <FormGroup
                            id='name'
                            label='Nama'
                            error={errors['name']}
                            required>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Nama Lengkap"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup
                            id='email'
                            label='Email'
                            error={errors['email']}
                            required>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup
                            className="md:col-span-2"
                            id='identity_num'
                            label='NIM / NIP / NIPH / Identitas Lainnya'
                            error={errors['identity_num']}
                            required>
                            <Input
                                id="identity_num"
                                type="identity_num"
                                name="identity_num"
                                placeholder="NIM / NIP / NIPH / Identitas Lainnya"

                                value={formData.identity_num}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup
                            id='role'
                            label='Daftar Sebagai'
                            error={errors['role']}
                            required>
                            <Select name='role' onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'role',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLSelectElement>)}>
                                <SelectTrigger className="w-full" data-testid='role'>
                                    <SelectValue placeholder="Daftar Sebagai" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Daftar Sebagai</SelectLabel>
                                        <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                                        <SelectItem value="pihak_luar">Pihak Luar</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormGroup>
                        {formData.role === 'pihak_luar' ? (
                            <div className="flex flex-col gap-2">
                                {isNotRegisteredInstitution ? (
                                    <FormGroup
                                        id='institution'
                                        label='Institusi'
                                        error={errors['institution']}
                                        required>
                                        <Input
                                            id="institution"
                                            type="text"
                                            name="institution"
                                            placeholder="Institusi"
                                            value={formData.institution}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                ) : (
                                    <FormGroup
                                        id='institution_id'
                                        label='Institusi'
                                        error={errors['institution_id']}
                                        required>
                                        <Combobox
                                            options={institutions}
                                            value={formData.institution_id?.toString() || ''}
                                            onChange={(val) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    institution_id: val ? Number(val) : null
                                                }))
                                            }}
                                            placeholder="Pilih Institusi"
                                            optionLabelKey='name'
                                            optionValueKey='id'
                                            testId="institution"
                                        />
                                    </FormGroup>
                                )}

                                <div className="flex items-center gap-3">
                                    <Checkbox id="institution_not_found" onCheckedChange={(val) => setIsNotRegisteredInstitution(val as boolean)} />
                                    <Label htmlFor="institution_not_found">institusi tidak terdaftar?</Label>
                                </div>
                            </div>
                        ) : (
                            <FormGroup
                                id='study_program_id'
                                label='Program Studi'
                                error={errors['study_program_id']}
                                required>
                                <Combobox
                                    options={studyPrograms}
                                    value={formData.study_program_id?.toString() || ''}
                                    onChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            study_program_id: val ? Number(val) : 0
                                        }))
                                    }}
                                    placeholder="Pilih Prodi"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                />
                            </FormGroup>
                        )}
                        <FormGroup
                            id='password'
                            label='Password'
                            error={errors['password']}
                            required>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="xxxxxxxxx"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup
                            id='c_password'
                            label='Password'
                            error={errors['c_password']}
                            required>
                            <PasswordInput
                                id="c_password"
                                name="c_password"
                                placeholder="xxxxxxxxx"
                                value={formData.c_password}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:col-span-2"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                        <div className="flex gap-2 text-sm md:col-span-2">
                            <p>Sudah punya akun?</p>
                            <NavLink to={'/login'} className='font-medium hover:text-blue-500'>Login</NavLink>
                        </div>
                    </form>
                </div>
                <div className="relative hidden xl:col-span-5 md:block">
                    <div className="absolute w-full h-full col-span-2 bg-black opacity-50"></div>
                    <img src="https://labterpadu.itk.ac.id/halaman_depan/07.png" alt="" className="object-cover w-full h-full" />
                </div>
            </div>
        </>
    );
};