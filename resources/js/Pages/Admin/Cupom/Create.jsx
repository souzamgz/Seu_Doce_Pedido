import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CupomCreate() {
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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/cupons', form, {
      onSuccess: () => setForm({
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
      })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-[#613d20] text-center">Cadastrar Cupom</h2>

      <input
        name="codigo"
        value={form.codigo}
        onChange={handleChange}
        placeholder="Código"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="descricao"
        value={form.descricao}
        onChange={handleChange}
        placeholder="Descrição"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <select name="tipo_desconto" value={form.tipo_desconto} onChange={handleChange} className="w-full border px-3 py-2 rounded">
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
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        name="valor_minimo"
        value={form.valor_minimo}
        onChange={handleChange}
        placeholder="Valor mínimo (opcional)"
        step="0.01"
        className="w-full border px-3 py-2 rounded"
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

        <br />
      <label htmlFor="data_inicio">Começa:</label>
      <input type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      <br />
      <label htmlFor="data_fim">Termina:</label>
      <input type="date" name="data_fim" value={form.data_fim} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

      <div className="flex gap-4">
        <label>
          <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} /> Ativo
        </label>
        <label>
          <input type="checkbox" name="apenas_primeira_compra" checked={form.apenas_primeira_compra} onChange={handleChange} /> Só 1ª compra
        </label>
        <label>
          <input type="checkbox" name="frete_gratis" checked={form.frete_gratis} onChange={handleChange} /> Frete grátis
        </label>
      </div>

      <button type="submit" className="bg-[#8a5a33] text-white px-4 py-2 rounded hover:bg-[#613d20]">Salvar Cupom</button>
    </form>
  );
}
