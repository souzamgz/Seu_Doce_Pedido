import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmarExclusao = () => {
        setConfirmandoExclusao(true);
    };

    const deletarConta = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => fecharModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const fecharModal = () => {
        setConfirmandoExclusao(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-red-600">
                    Excluir Conta
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ao excluir sua conta, todos os seus dados serão apagados permanentemente. 
                    Antes disso, baixe qualquer informação que queira guardar.
                </p>
            </header>

            <DangerButton onClick={confirmarExclusao}>
                Excluir Conta
            </DangerButton>

            <Modal show={confirmandoExclusao} onClose={fecharModal}>
                <form onSubmit={deletarConta} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Tem certeza que quer excluir sua conta?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Depois de excluir, todos os seus dados serão apagados de forma definitiva. 
                        Digite sua senha para confirmar.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Senha"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Digite sua senha"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={fecharModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Confirmar Exclusão
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
