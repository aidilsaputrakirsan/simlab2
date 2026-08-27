import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ApiResponse } from "../shared/Types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useValidationErrors } from "../hooks/useValidationError";
import { toast } from "sonner";
import ItkLogo from '../assets/itk_logo.png'
import { ForgotPasswordDTO } from "@/application/auth/AuthDTO";
import { AuthService } from "@/application/auth/AuthService";
import FormGroup from "../components/custom/FormGroup";
import { MailCheck } from "lucide-react";

const authService = new AuthService();

export const ForgotPasswordPage: React.FC = () => {
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [formData, setFormData] = useState<ForgotPasswordDTO>({ email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

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
            const message = await authService.forgotPassword(formData);
            setIsSent(true)
            toast.success(message)
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors);
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

    return (
        <>
            <div className="grid min-h-screen bg-white md:grid-cols-2 lg:grid-cols-9">
                <div className="flex flex-col items-center w-full px-5 py-32 gap-5 sm:px-10 md:px-16 lg:px-10 xl:px-16 h-fit lg:col-span-3">
                    <img src={ItkLogo} className="w-36" alt="" />
                    <div className="w-full text-left">
                        <h3 className="text-3xl font-medium">Lupa Password</h3>
                        <h4 className="text-muted-foreground">Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang password.</h4>
                    </div>

                    {isSent ? (
                        <div className="flex flex-col w-full gap-5">
                            <div className="flex gap-3 p-4 text-sm border rounded-md bg-emerald-50 border-emerald-200 text-emerald-800">
                                <MailCheck className="w-5 h-5 shrink-0" />
                                <div>
                                    <p className="font-medium">Tautan reset password telah dikirim</p>
                                    <p className="mt-1">Silakan cek kotak masuk email <span className="font-medium">{formData.email}</span>. Jika tidak ada, periksa juga folder spam.</p>
                                </div>
                            </div>
                            <Button type="button" variant="outline" onClick={() => setIsSent(false)}>Kirim ulang</Button>
                            <div className="flex gap-2 text-sm">
                                <p>Sudah ingat password Anda?</p>
                                <NavLink to={'/login'} className='font-medium hover:text-blue-500'>Login</NavLink>
                            </div>
                        </div>
                    ) : (
                        <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
                            <FormGroup
                                id="email"
                                label="Email"
                                error={errors['email']}
                                required
                            >
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}</Button>
                            <div className="flex gap-2 text-sm">
                                <p>Sudah ingat password Anda?</p>
                                <NavLink to={'/login'} className='font-medium hover:text-blue-500'>Login</NavLink>
                            </div>
                        </form>
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
