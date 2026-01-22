import { useEffect, useState } from "react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/hooks/useAuth";
import { ApiResponse } from "../shared/Types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useValidationErrors } from "../hooks/useValidationError";
import { toast } from "sonner";
import ItkLogo from '../assets/itk_logo.png'
import { LoginDTO } from "@/application/auth/AuthDTO";
import FormGroup from "../components/custom/FormGroup";
import PasswordInput from "../components/custom/PasswordInput";

export const Login: React.FC = () => {
    // hooks
    const { user, login } = useAuth();
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [formData, setFormData] = useState<LoginDTO>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
            await login(formData);
            navigate('/panel');
        } catch (e) {
            const error = e as ApiResponse
            if (error.message === 'Unauthorized') {
                toast.error('Email atau password salah!')
            } else if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.classList.remove("dark")
    }, [])

    if (user) {
        return <Navigate to="/panel" state={{ from: location }} replace />;
    }

    return (
        <>
            <div className="grid min-h-screen bg-white md:grid-cols-2 lg:grid-cols-9">
                <div className="flex flex-col items-center w-full px-5 py-32 gap-5 sm:px-10 md:px-16 lg:px-10 xl:px-16 h-fit lg:col-span-3">
                    <img src={ItkLogo} className="w-36" alt="" />
                    <div className="w-full text-left">
                        <h3 className="text-3xl font-medium">Selamat Datang</h3>
                        <h4 className=" text-muted-foreground">Silakan masuk ke akun Anda.</h4>
                    </div>
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
                        <FormGroup
                            id="password"
                            label="Password"
                            error={errors['password']}
                            required
                        >
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            
                        </FormGroup>

                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
                        <div className="flex gap-2 text-sm">
                            <p>Belum Punya Akun?</p>
                            <NavLink to={'/register'} className='font-medium hover:text-blue-500'>Daftar</NavLink>
                        </div>
                    </form>
                </div>
                <div className="relative hidden md:block lg:col-span-6">
                    <div className="absolute w-full h-full col-span-2 bg-black opacity-50"></div>
                    <img src="https://labterpadu.itk.ac.id/halaman_depan/07.png" alt="" className="object-cover w-full h-full" />
                </div>
            </div>
        </>
    );
};