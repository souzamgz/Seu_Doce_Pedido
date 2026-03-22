import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { FiArrowLeft, FiFolderPlus } from 'react-icons/fi';

export default function PromocaoEdit({ promocao, products }) {
  const [ativo, setAtivo] = useState(false);
  
  const [formData, setFormData] = useState({
    Id_Product: promocao.Id_Product || '',
    descricao: promocao.descricao || '',
    price: promocao.price || '',
    quantidade: promocao.quantidade || '',
    estoque: promocao.estoque || '',
    imagem: null,
  });

  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (promocao) {
      
      setAtivo(promocao.ativo);
    }
  }, [promocao]);

  useEffect(() => {
    if (promocao.imagem) {
      setPreviewImage(`${promocao.imagem}`);
    }
  }, [promocao]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    for (const key in formData) {
      if (formData[key] !== null) {
        data.append('ativo', ativo ? 1 : 0);
        data.append(key, formData[key]);
      }
    }

    router.post(`/promocoes/${promocao.id}?_method=PUT`, data, {
      forceFormData: true,
    });
  };

  const handleBack = () => {
    router.visit('/promocoes');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-lg">
      <button
        onClick={handleBack}
        className="flex items-center text-[#8a5a33] hover:text-[#613d20] mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Voltar
      </button>

      <h2 className="text-3xl font-extrabold text-[#613d20] mb-6 text-center" style={{ fontFamily: "'Candice', cursive" }}>
        Editar Promoção
      </h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#613d20] mb-1">Produto (opcional)</label>
          <select
            name="Id_Product"
            value={formData.Id_Product}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] transition text-sm"
          >
            <option value="">Selecione um produto</option>
            {products.map(prod => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#613d20] mb-1">Descrição</label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição da promoção"
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20]transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#613d20] mb-1">Preço *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#8a5a33] mb-1">Quantidade</label>
          <input
            type="number"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#613d20] mb-1">Estoque</label>
          <input
            type="number"
            name="estoque"
            value={formData.estoque}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#8a5a33] mb-1">Imagem</label>

          {previewImage && (
            <img
              src={previewImage}
              alt="Prévia da imagem"
              className="mb-3 w-32 h-32 object-cover rounded-xl border border-gray-300 shadow-sm"
            />
          )}

          <div className="flex items-center gap-4">
            <label
              htmlFor="imagem"
              className="inline-flex items-center px-4 py-2 bg-[#8a5a33] text-white text-sm font-medium rounded-xl shadow hover:bg--[#613d20] cursor-pointer transition"
            >
              <FiFolderPlus className="mr-2" />
              Selecionar nova imagem
            </label>

            <span className="text-sm text-gray-700 truncate max-w-[200px]">
              {formData.imagem?.name || 'Nenhuma imagem nova selecionada'}
            </span>
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

          <input
            id="imagem"
            name="imagem"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#8a5a33] text-white font-bold rounded-xl hover:bg-[#613d20] transition hover:scale-105 shadow-md"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
