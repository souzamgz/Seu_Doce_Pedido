import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CupomIndex({ cupons, onEdit }) {
  const [search, setSearch] = useState('');

  const filtered = cupons.filter(c => c.codigo.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => {
    if (confirm('Deseja realmente excluir este cupom?')) {
      router.delete(`/cupons/${id}`);
    }
  };

  return (
    <div className="mt-10">
      <input
        type="text"
        placeholder="Pesquisar cupom..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? filtered.map(c => (
          <div
            key={c.id}
            className="relative bg-yellow-50 border border-[#d4af37] rounded-xl p-6 shadow-md flex justify-between items-center"
          >
            {/* Furos à esquerda */}
            <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between w-3">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="block w-2 h-2 bg-white rounded-full shadow-inner mx-auto"
                />
              ))}
            </div>

            <div className="ml-6">
              <p className="font-bold text-[#613d20] text-lg">{c.codigo}</p>
              <p className="text-sm text-gray-600">{c.descricao}</p>
              <p className="mt-1 text-[#613d20] font-semibold">
                {c.tipo_desconto === 'percentual' 
                  ? `${c.valor_desconto}%` 
                  : `R$ ${parseFloat(c.valor_desconto).toFixed(2)}`}
              </p>
              <p className="text-sm mt-1">{c.ativo ? 'Ativo' : 'Inativo'}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onEdit(c)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-500">Nenhum cupom encontrado</p>
        )}
      </div>
    </div>
  );
}
