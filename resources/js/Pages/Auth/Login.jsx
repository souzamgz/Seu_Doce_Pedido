import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in">
                <link
                    href="https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Botão voltar no canto superior esquerdo da área branca */}
          

            {/* Container geral */}
            <div className="w-full max-w-md font-poppins mx-auto px-4 relative">
                  
            <div className="relative w-full max-w-md font-poppins">
                <Link
    href="/"
    className=" top-6 left-4 md:left-[52%] p-2 flex items-center space-x-1 text-[#613d20]  transition-transform duration-300 hover:scale-110 animate-pulseArrow z-30"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    <span>Voltar</span>
</Link>

                </div>
                
               
            
                <h2 className="text-4xl text-[#613d20] text-center mb-8 tracking-wider font-Montserrat font-extrabold">
                   LOGIN
                </h2>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 animate-fadeIn">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4 animate-fadeInUp">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#613d20] focus:ring focus:ring-[#613d20] focus:ring-opacity-50 transition duration-300 ease-in-out"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Senha" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#613d20] focus:ring focus:ring-[#613d20] focus:ring-opacity-50 transition duration-300 ease-in-out"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-gray-600">Lembre de mim</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-[#8a5a33] hover:underline"
                            >
                                Esqueceu sua Senha?
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-col items-center space-y-4 pt-6">
                        <Link
                            href={route('register')}
                            className="text-sm text-[#613d20] font-semibold hover:underline text-center w-full max-w-xs"
                        >
                            Não possui uma conta? Cadastre-se
                        </Link>

                        <button
                            type="submit"
                            className="w-full max-w-xs bg-[#613d20] text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                            disabled={processing}
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                <style>{`
                   @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

                    .font-Montserrat {
                        font-family: 'Montserrat', sans-serif;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.7s ease forwards;
                    }

                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeInUp {
                        animation: fadeInUp 0.8s ease forwards;
                    }

                    .login-title {
                        font-family: 'Lobster', cursive !important;
                        font-size: 3rem;
                    }
                `}</style>
            </div>
        </GuestLayout>
    );
}
