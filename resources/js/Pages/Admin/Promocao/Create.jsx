import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { FiFolderPlus } from 'react-icons/fi';

export default function PromocaoCreate({ products }) {
  const [formData, setFormData] = useState({
    Id_Product: '',
    nome: '',
    descricao: '',
    price: '',
    quantidade: '',
    estoque: '',
    imagem: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    router.post('/promocoes', data, {
      forceFormData: true,
      onSuccess: () => setFormData({
        Id_Product: '',
        nome: '',
        descricao: '',
        price: '',
        quantidade: '',
        estoque: '',
        imagem: null,
      }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#8a5a33] rounded-3xl shadow-lg p-6 sm:p-10 space-y-6 mb-10 max-w-4xl mx-auto"
      encType="multipart/form-data"
    >
      <h2 className="text-3xl font-extrabold text-[#613d20] text-center mb-6">
        Criar Promoção
      </h2>

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
        <label className="block text-sm font-semibold text-[#613d20] mb-1">Nome:</label>
       <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome da Promoção"
          className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] transition text-sm"
        />
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
          placeholder="Preço"
          step="0.01"
          required
          className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20]transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#613d20] mb-1">Quantidade:</label>
        <input
          type="number"
          name="quantidade"
          value={formData.quantidade}
          placeholder="Unidade por Compra"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#8a5a33] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#613d20]  mb-1">Estoque(kit):</label>
        <input
          type="number"
          name="estoque"
          value={formData.estoque}
          placeholder="Valor inteiro (quantidade)"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#8a5a33]rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20] transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#613d20] mb-1">Imagem </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="imagem"
            className="inline-flex items-center px-4 py-2 bg-[#8a5a33] text-white text-sm font-medium rounded-xl shadow hover:bg-[#613d20] cursor-pointer transition"
          >
            <FiFolderPlus className="mr-2" />
            Selecionar imagem 
          </label>
          <span className="text-sm text-gray-700 truncate max-w-[200px]">
            {formData.imagem?.name || 'Nenhuma imagem selecionada'}
          </span>
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
        className="w-full py-3 bg-[#8a5a33] text-white font-bold rounded-xl hover:bg--[#613d20] transition hover:scale-105 shadow-md"
      >
        Criar Promoção
      </button>
    </form>
  );
}
