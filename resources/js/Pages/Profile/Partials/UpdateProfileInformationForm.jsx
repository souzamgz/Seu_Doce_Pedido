import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
    e.preventDefault();
    patch(route('profile.update'), {
        preserveScroll: true,
    });
};

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-extrabold text-[#613d20]">
                    Informações do Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Atualize seu nome e email !
                </p>
                <p className="mt-1 text-sm text-gray-600">
                Mantenha seus dados sempre atualizados.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nome" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                        <p className="text-sm text-yellow-800">
                            Seu email ainda não foi verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 rounded-md text-sm text-[#613d20] underline hover:text-[#8a5a33]"
                            >
                                Clique aqui para reenviar o email de verificação.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Um novo link de verificação foi enviado para seu email.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 ">
                    <PrimaryButton disabled={processing} >
                        Salvar
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">
                            Salvo com sucesso.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
