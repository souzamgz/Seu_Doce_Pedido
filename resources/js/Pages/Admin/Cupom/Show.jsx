import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function CupomEdit({ cupom, onClose }) {
  const [form, setForm] = useState({
    codigo: '',
    descricao: '',
    tipo_desconto: 'percentual',
    valor_desconto: '',
    valor_minimo: '',
    data_inicio: '',
    limite_usos: '',
    data_fim: '',
    ativo: true,
    apenas_primeira_compra: false,
    frete_gratis: false,
    produto_id: '',
    categoria_id: '',
  });

  useEffect(() => {
    if (cupom) {
      setForm({
        codigo: cupom.codigo || '',
        descricao: cupom.descricao || '',
        tipo_desconto: cupom.tipo_desconto || 'percentual',
        valor_desconto: cupom.valor_desconto || '',
        valor_minimo: cupom.valor_minimo || '',
        limite_usos: cupom.limite_usos || '',
        data_inicio: cupom.data_inicio || '',
        data_fim: cupom.data_fim || '',
        ativo: cupom.ativo ?? true,
        apenas_primeira_compra: cupom.apenas_primeira_compra ?? false,
        frete_gratis: cupom.frete_gratis ?? false,
        produto_id: cupom.produto_id || '',
        categoria_id: cupom.categoria_id || '',
      });
    }
  }, [cupom]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(`/cupons/${cupom.id}?_method=PUT`, form, {
      preserveScroll: true,
      onSuccess: onClose,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-6 sm:p-8 relative max-h-[90vh] overflow-auto">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center text-[#613d20] mb-6">Editar Cupom</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            placeholder="Código"
            required
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

          <input
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Descrição"
            required
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

          <select
            name="tipo_desconto"
            value={form.tipo_desconto}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          >
            <option value="percentual">Percentual</option>
            <option value="valor">Valor fixo</option>
          </select>

          <input
            type="number"
            name="valor_desconto"
            value={form.valor_desconto}
            onChange={handleChange}
            placeholder="Valor do desconto"
            step="0.01"
            required
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

          <input
            type="number"
            name="valor_minimo"
            value={form.valor_minimo}
            onChange={handleChange}
            placeholder="Valor mínimo (opcional)"
            step="0.01"
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

              <input
        type="number"
        name="limite_usos"
        value={form.limite_usos}
        onChange={handleChange}
        placeholder="Limite Usos (opcional)"
        step="1.0"
        className="w-full border px-3 py-2 rounded"
      />

          <input
            type="date"
            name="data_inicio"
            value={form.data_inicio}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

          <input
            type="date"
            name="data_fim"
            value={form.data_fim}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} />
              Ativo
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="apenas_primeira_compra" checked={form.apenas_primeira_compra} onChange={handleChange} />
              Só 1ª compra
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="frete_gratis" checked={form.frete_gratis} onChange={handleChange} />
              Frete grátis
            </label>
          </div>

          <input
            type="number"
            name="produto_id"
            value={form.produto_id}
            onChange={handleChange}
            placeholder="ID do produto (opcional)"
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

          <input
            type="number"
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            placeholder="ID da categoria (opcional)"
            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a33]"
          />

          <button
            type="submit"
            className="w-full py-3 bg-[#8a5a33] hover:bg-[#613d20] text-white font-semibold rounded-xl shadow-lg transition"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
