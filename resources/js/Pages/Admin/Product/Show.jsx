import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {FiFolderPlus } from 'react-icons/fi';

export default function CategoryEdit({ product, categories, onClose }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.descricao || '');
      setSelectedCategoryId(product.id_categoria);
      setPreviewImage(`${product.imagem}`);
      setImageFile(null);
      setAtivo(product.ativo);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('descricao', description);
    formData.append('id_categoria', selectedCategoryId);
    if (imageFile) {
      formData.append('imagem', imageFile);
    }
    formData.append('ativo', ativo ? 1 : 0);

    router.post(`/products/${product.id}?_method=PUT`, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: onClose,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#613d20] mb-6">Editar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        
        {/* Nome */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nome do Produto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33] transition"
            required
          />
        </div>

        {/* Preço */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Preço</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33] transition"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33] transition"
            rows={4}
            placeholder="Detalhes do produto..."
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Categoria</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33] transition"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Imagem */}
        <div>
  <label className="block text-sm font-semibold text-[#613d20] mb-1">
    Imagem do Produto
  </label>

  {/* Prévia da imagem, se houver */}
  {previewImage && (
    <img
      src={previewImage}
      alt="Prévia da imagem"
      className="mb-3 w-32 h-32 object-cover rounded-xl border border-gray-300 shadow-sm"
    />
  )}

  {/* Botão de seleção e nome da imagem */}
  <div className="flex items-center gap-4">
    <label
      htmlFor="imagemProduto"
      className="inline-flex items-center px-4 py-2 bg-[#8a5a33] text-white text-sm font-medium rounded-xl shadow hover:bg-[#613d20] cursor-pointer transition"
    >
      <FiFolderPlus className="mr-2" />
      Selecionar imagem
    </label>

    <span className="text-sm text-gray-700 truncate max-w-[200px]">
      {imageFile?.name || 'Nenhuma imagem selecionada'}
    </span>
  </div>

  {/* Input de imagem real (oculto) */}
  <input
    id="imagemProduto"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />
</div>
<div className="flex items-center gap-2">
  <input
    id="ativo"
    type="checkbox"
    checked={ativo}
    onChange={() => setAtivo(!ativo)}
    className="w-5 h-5 rounded"
  />
  <label htmlFor="ativo" className="text-gray-700 font-medium">
    Produto Ativo
  </label>
</div>


        {/* Botão */}
        <button
          type="submit"
          className="w-full py-3 bg-[#8a5a33] hover:bg-[#613d20] text-white font-semibold rounded-xl shadow-lg transition"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
