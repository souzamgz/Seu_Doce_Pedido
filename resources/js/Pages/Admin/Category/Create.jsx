import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { FiFolderPlus, FiFolder, FiEye, FiTrash2 } from 'react-icons/fi'; // Ícones

export default function CategoryCreate() {
    const [name, setName] = useState('');
    const [imagem, setImagem] = useState(null);
    const { categories } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    if (imagem) {
    formData.append('imagem', imagem);
  }

        router.post('/categories', formData, {
    forceFormData: true, // garante que envie como multipart/form-data
    onSuccess: () => {
      setName('');
      setImagem(null);
    },
  });
};

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            router.delete(`/categories/${id}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Formulário */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-[#8a5a33]  rounded-3xl shadow-lg p-6 sm:p-10 space-y-6"
            >
                <div className="flex items-center gap-3 justify-center">
                    <FiFolderPlus className="text-[#613d20] w-8 h-8" />
                    <h2
                        className="text-3xl font-extrabold text-[#613d20] text-center"
                        
                    >
                        Criar Categoria
                    </h2>
                </div>

                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-[#613d20] mb-1"
                    >
                        Nome da categoria
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33] focus:border-[#8a5a33] transition text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Digite o nome da nova categoria"
                    />
                </div>
       <div>
  <label className="block text-sm font-semibold text-[#613d20] mb-1">
    Imagem da Categoria
  </label>

  <div className="flex items-center gap-4">
    <label
      htmlFor="imagem"
      className="inline-flex items-center px-4 py-2 bg-[#613d20] text-white text-sm font-medium rounded-xl shadow hover:bg-p-[#8a5a33] cursor-pointer transition"
    >
      <FiFolderPlus className="mr-2" />
      Selecionar imagem
    </label>

    {/* Mostrar nome do arquivo selecionado */}
    <span className="text-sm text-gray-700 truncate max-w-[200px]">
      {imagem?.name || 'Nenhuma imagem selecionada'}
    </span>
  </div>

  {/* Input real oculto */}
  <input
    required 
    id="imagem"
    type="file"
    accept="image/*"
    onChange={(e) => setImagem(e.target.files[0])}
    className="hidden"
  />
</div>

                <button
                    type="submit"
                    className="w-full py-2 bg-[#613d20] text-white text-base font-bold rounded-xl hover:bg-[#8a5a33] transition hover:scale-105 shadow-md"
                >
                    Salvar Categoria
                </button>
            </form>

            {/* Grid de Categorias */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories?.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between bg-white border border-[#8a5a33] rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-3">
                            <FiFolder className="text-[#8a5a33]  w-6 h-6" />
                            <span className="text-sm font-semibold text-[#613d20] ">{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => router.get(`/categories/${category.id}`)}
                                className="text-[#613d20]  transition"
                                title="Ver"
                            >
                                <FiEye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Excluir"
                            >
                                <FiTrash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
