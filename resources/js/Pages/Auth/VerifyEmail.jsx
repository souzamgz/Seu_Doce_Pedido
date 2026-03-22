import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-6 text-sm text-gray-600 font-poppins max-w-md mx-auto text-center">
                Obrigado por se cadastrar! Antes de começar, você poderia verificar
                seu endereço de e-mail clicando no link que acabamos de enviar
                para você? Se você não recebeu o e-mail, teremos prazer em enviar
                outro.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-sm font-medium text-green-600 font-poppins max-w-md mx-auto text-center">
                    Um novo link de verificação foi enviado para o endereço de e-mail
                    que você forneceu durante o registro.
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col items-center max-w-md mx-auto space-y-6">
                <PrimaryButton
                    disabled={processing}
                    className="w-full bg-[#EF3167] hover:bg-[#613d20] transition-colors duration-200 font-semibold rounded-lg py-3"
                >
                    Reenviar e-mail de verificação
                </PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-[#EF3167] font-semibold hover:text-[#613d20] underline text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#EF3167] focus:ring-offset-2 rounded"
                >
                    Log Out
                </Link>
            </form>
        </GuestLayout>
    );
}
