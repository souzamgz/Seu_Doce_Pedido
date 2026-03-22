import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register">
                <link
                    href="https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative w-full max-w-md font-poppins">
                <div className="relative w-full max-w-md font-poppins">
                    <Link
                        href="/"
                        className="top-6 left-4 md:left-[52%] p-2 flex items-center space-x-1 text-[#613d20] hover:text-[#613d20] transition-transform duration-300 hover:scale-110 animate-pulseArrow z-30"
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
                    CADASTRO
                </h2>


                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nome" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#613d20] focus:ring focus:ring-[#613d20] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#613d20] focus:ring focus:ring-[#613d20] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="username"
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
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#613d20] focus:ring focus:ring-[#613d20] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
             
                    </div>
                    

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirme sua senha" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#613d20] focus:ring focus:ring-[#613d20] focus:ring-opacity-50 transition duration-300 ease-in-out pl-3"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
        A senha deve atender aos seguintes critérios:
    </p>
    <ul className="text-xs text-gray-600 list-disc list-inside ml-2">
        <li>Mínimo de 8 caracteres</li>
        <li>Deve conter letras maiúsculas e minúsculas</li>
        <li>Deve conter números</li>
        <li>Não pode estar comprometida em vazamentos (segura)</li>
    </ul>
                    <div className="flex flex-col items-center justify-center pt-4 space-y-4">
                        <Link
                            href={route('login')}
                            className="text-sm text-[#613d20] hover:underline text-center"
                        >
                            Já está cadastrado?
                        </Link>

                        <button
                            type="submit"
                            className="w-3/4 bg-[#613d20]  text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                            disabled={processing}
                        >
                            Registrar
                        </button>
                    </div>
                </form>

                <style>{`
                   @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

                   .font-Montserrat {
                        font-family: 'Montserrat', sans-serif;
                    }

                
                `}</style>
            </div>
        </GuestLayout>
    );
}
