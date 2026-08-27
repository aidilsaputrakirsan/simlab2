import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { ApiResponse } from "../shared/Types";
import { Button } from "../components/ui/button";
import { useValidationErrors } from "../hooks/useValidationError";
import { toast } from "sonner";
import ItkLogo from '../assets/itk_logo.png'
import { ResetPasswordDTO } from "@/application/auth/AuthDTO";
import { AuthService } from "@/application/auth/AuthService";
import FormGroup from "../components/custom/FormGroup";
import PasswordInput from "../components/custom/PasswordInput";
import { TriangleAlert } from "lucide-react";

const authService = new AuthService();

export const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const email = searchParams.get('email') ?? '';

    const { errors, setErrors, processErrors } = useValidationErrors()
    const [formData, setFormData] = useState<ResetPasswordDTO>({ token, email, password: '', c_password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setErrors({})
            const message = await authService.resetPassword(formData);
            toast.success(message)
            navigate('/login');
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors);
                if (error.errors['token']) {
                    toast.error(error.errors['token'][0])
                }
            } else {
                toast.error(error.message ?? 'Terjadi kesalahan, silakan coba lagi.')
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.classList.remove("dark")
    }, [])

    const isLinkValid = token !== '' && email !== '';

    return (
        <>
            <div className="grid min-h-screen bg-white md:grid-cols-2 lg:grid-cols-9">
                <div className="flex flex-col items-center w-full px-5 py-32 gap-5 sm:px-10 md:px-16 lg:px-10 xl:px-16 h-fit lg:col-span-3">
                    <img src={ItkLogo} className="w-36" alt="" />
                    <div className="w-full text-left">
                        <h3 className="text-3xl font-medium">Atur Ulang Password</h3>
                        <h4 className="text-muted-foreground">
                            {isLinkValid ? `Buat password baru untuk akun ${email}.` : 'Tautan reset password tidak lengkap.'}
                        </h4>
                    </div>

                    {isLinkValid ? (
                        <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
                            <FormGroup
                                id="password"
                                label="Password Baru"
                                error={errors['password']}
                                required
                            >
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="Password baru"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup
                                id="c_password"
                                label="Konfirmasi Password Baru"
                                error={errors['c_password']}
                                required
                            >
                                <PasswordInput
                                    id="c_password"
                                    name="c_password"
                                    placeholder="Ulangi password baru"
                                    value={formData.c_password}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}</Button>
                            <div className="flex gap-2 text-sm">
                                <p>Kembali ke</p>
                                <NavLink to={'/login'} className='font-medium hover:text-blue-500'>Login</NavLink>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col w-full gap-5">
                            <div className="flex gap-3 p-4 text-sm text-red-800 border border-red-200 rounded-md bg-red-50">
                                <TriangleAlert className="w-5 h-5 shrink-0" />
                                <div>
                                    <p className="font-medium">Tautan tidak valid</p>
                                    <p className="mt-1">Buka halaman ini melalui tautan yang dikirim ke email Anda, atau ajukan permintaan reset password baru.</p>
                                </div>
                            </div>
                            <NavLink to={'/forgot-password'}>
                                <Button type="button" className="w-full">Ajukan Ulang Lupa Password</Button>
                            </NavLink>
                        </div>
                    )}
                </div>
                <div className="relative hidden md:block lg:col-span-6">
                    <div className="absolute w-full h-full col-span-2 bg-black opacity-50"></div>
                    <img src="https://labterpadu.itk.ac.id/halaman_depan/07.png" alt="" className="object-cover w-full h-full" />
                </div>
            </div>
        </>
    );
};
