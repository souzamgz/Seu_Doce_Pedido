import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function CreateBannerForm({ closeModal }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nome: '',
        imagem: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/banners', {
            forceFormData: true, // Isso é ESSENCIAL para upload de arquivos
            onSuccess: () => {
                closeModal();   // Fecha o modal ao criar
                reset();        // Limpa o formulário
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Novo Banner</h2>

            <div className="mb-4">
                <label className="block text-sm text-gray-700">Nome</label>
                <input
                    type="text"
                    value={data.nome}
                    onChange={(e) => setData('nome', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
                {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm text-gray-700">Imagem</label>
                <input
                    type="file"
                    onChange={(e) => setData('imagem', e.target.files[0])}
                    className="mt-1"
                />
                {errors.imagem && <p className="text-sm text-red-500">{errors.imagem}</p>}
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={closeModal}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                    Criar Banner
                </button>
            </div>
        </form>
    );
}
