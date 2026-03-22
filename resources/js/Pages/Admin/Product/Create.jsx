import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import CategoryEdit from './Show'; // componente para editar produto (modal)
import { FiBox, FiTrash2, FiSearch, FiFolderPlus } from 'react-icons/fi';

export default function ProductCreate({ categories }) {
  const { products } = usePage().props;

  // Estados para criação do produto
  const [name, setName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [price, setPrice] = useState('');
  const [id_categoria, setIdCategoria] = useState(categories.length > 0 ? categories[0].id : '');
  const [imagem, setImagem] = useState(null);

  // Estados para filtro de busca
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modal de edição
  const [modalOpen, setModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Função para criar produto
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('descricao', descricao);
    formData.append('price', price);
    formData.append('id_categoria', id_categoria);
    if (imagem) formData.append('imagem', imagem);

    router.post('/products', formData, {
      forceFormData: true,
      onSuccess: () => {
        setName('');
        setDescricao('');
        setPrice('');
        setIdCategoria(categories.length > 0 ? categories[0].id : '');
        setImagem(null);
      },
    });
  };

  // Abrir modal para editar
  const openEditModal = (product) => {
    setProductToEdit(product);
    setModalOpen(true);
  };

  // Fechar modal
  const closeEditModal = () => {
    setModalOpen(false);
    setProductToEdit(null);
  };

  // Deletar produto
  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      router.delete(`/products/${id}`);
    }
  };

  // Filtra produtos pelo termo digitado
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Formulário de criação */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#8a5a33] rounded-3xl shadow-lg p-6 sm:p-10 space-y-6"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-extrabold text-[#613d20] text-center mb-6">
          Cadastrar Produto
        </h2>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#613d20] mb-1">
            Nome
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] focus:border-[#613d20] transition text-sm"
            placeholder="Nome do produto"
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-semibold text-[#613d20] mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] focus:border-[#613d20] transition text-sm"
            placeholder="Descrição do produto"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-[#613d20] mb-1">
            Preço
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] focus:border-[#613d20] transition text-sm"
            placeholder="Preço do produto"
          />
        </div>

        <div>
          <label htmlFor="id_categoria" className="block text-sm font-semibold text-[#613d20] mb-1">
            Categoria
          </label>
          <select
            id="id_categoria"
            value={id_categoria}
            onChange={e => setIdCategoria(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] focus:border-[#613d20] transition text-sm"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

      <div>
  <label className="block text-sm font-semibold text-[#613d20] mb-1">
    Imagem da Categoria
  </label>

  {/* Prévia da imagem selecionada */}
  {imagem && (
    <img
      src={URL.createObjectURL(imagem)}
      alt="Prévia da imagem"
      className="mb-3 w-32 h-32 object-cover rounded-xl border border-gray-300 shadow-sm"
    />
  )}

  {/* Botão customizado + nome do arquivo */}
  <div className="flex items-center gap-4">
    <label
      htmlFor="imagem"
      className="inline-flex items-center px-4 py-2 bg-[#8a5a33] text-white text-sm font-medium rounded-xl shadow hover:bg-[#613d20] cursor-pointer transition"
    >
      <FiFolderPlus className="mr-2" />
      Selecionar imagem
    </label>

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
    onChange={e => setImagem(e.target.files[0])}
    className="hidden"
  />
</div>


        <button
          type="submit"
          className="w-full py-2 bg-[#8a5a33] text-white text-base font-bold rounded-xl hover:bg-[#613d20] transition hover:scale-105 shadow-md"
        >
          Salvar Produto
        </button>
      </form>

      {/* Barra de pesquisa */}
      <div className="mt-10 mb-6 max-w-md mx-auto flex items-center gap-3">
        <FiSearch className="text-[#8a5a33] w-6 h-6" />
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] focus:border-[#613d20] transition text-sm"
        />
      </div>

      {/* Lista de produtos filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-lg
      ">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white border border-[#8a5a33] rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <img
                src={`${product.imagem}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h4 className="text-[#613d20] font-semibold text-lg">{product.name}</h4>
              <p className="text-gray-500 text-sm">{product.descricao}</p>
              <p className="text-[#613d20] font-bold mt-1">R$ {parseFloat(product.price).toFixed(2)}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openEditModal(product)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <FiBox className="w-4 h-4" />
                  Editar
                </button>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este produto?')) {
                      router.delete(`/products/${product.id}`);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#613d20] font-semibold">Nenhum produto encontrado.</p>
        )}
      </div>

      {/* Modal de edição */}
      <Modal show={modalOpen} onClose={closeEditModal} maxWidth="2xl" closeable={true}>
        {productToEdit && (
          <CategoryEdit
            product={productToEdit}
            categories={categories}
            onClose={closeEditModal} // fecha o modal após salvar
          />
        )}
      </Modal>
    </div>
  );
}
