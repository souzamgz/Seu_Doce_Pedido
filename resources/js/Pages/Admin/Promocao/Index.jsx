import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { FiEye, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi';
import Modal from '@/Components/Modal';

export default function PromocaoIndex({ promocoes, products }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);
  const [promocaoIdParaExcluir, setPromocaoIdParaExcluir] = useState(null);
  const [search, setSearch] = useState('');
  const [filterAtivo, setFilterAtivo] = useState('todos');

  const handleDelete = (id) => {
    setPromocaoIdParaExcluir(id);
    setShowModalDel(true);
  };

  const confirmarDelete = () => {
    router.delete(`/promocoes/${promocaoIdParaExcluir}`);
    setShowModalDel(false);
  };

  const handleNotDel = () => {
    setShowModal(true);
  };

  const filteredPromocoes = promocoes.filter((promo) => {
    const nome = promo.nome || promo.product?.name || '';
    const categoria = promo.product?.category?.name || '';
    const preco = String(promo.price);
    const ativo = promo.ativo ? 'ativo' : 'inativo';

    const matchesSearch = nome.toLowerCase().includes(search.toLowerCase()) ||
                          categoria.toLowerCase().includes(search.toLowerCase()) ||
                          preco.includes(search);

    const matchesAtivo = filterAtivo === 'todos' || filterAtivo === ativo;

    return matchesSearch && matchesAtivo;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-[#613d20] mb-8 text-center">
        Promoções Atuais
      </h2>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 items-center">
        <div className="flex items-center gap-2 w-full md:w-2/3">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nome, categoria ou preço"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-[#8a5a33] focus:border-[#8a5a33]"
          />
        </div>
        <div className="flex gap-2 items-center w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filterAtivo}
            onChange={(e) => setFilterAtivo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-[#8a5a33] focus:border-[#8a5a33]"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromocoes.map((promo) => (
          <div
            key={promo.id}
            className="bg-white border border-[#8a5a33] rounded-3xl shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-[#613d20]">
                Produto: {promo.Id_Product ? promo.product.name : promo.nome}
              </p>
              <p className="text-sm text-gray-600 mb-2">{promo.descricao || '-'}</p>
              <p className="text-lg font-bold text-[#613d20]">R$ {Number(promo.price).toFixed(2).replace('.', ',')}</p>
              <p className="text-sm text-gray-600">Qtd: {promo.quantidade ?? '-'}</p>
              <p className="text-sm text-gray-600">Estoque: {promo.estoque ?? '-'}</p>
            </div>

            {promo.imagem ? (
              <img
                src={`${promo.imagem}`}
                alt="Imagem da promoção"
                className="mt-4 rounded-xl w-full h-40 object-cover"
              />
            ) : promo.product?.imagem ? (
               
              <img
                src={`${promo.product.imagem}`}
                alt="Imagem da promoção"
                className="mt-4 rounded-xl w-full h-40 object-cover"
              />
              ): (
              <div className="mt-4 rounded-xl w-full h-40 object-cover">
                Sem Imagem
                </div>
              )
             
            }

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => router.get(`/promocoes/${promo.id}/edit`)}
                className="text-[#613d20] hover:text-[#613d20] transition"
                title="Editar"
              >
                <FiEdit size={22} />
              </button>

              {promo.ativo ? (
                <button
                  onClick={() => handleNotDel()}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Excluir"
                >
                  <FiTrash2 size={22} />
                </button>
              ) : (
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Excluir"
                >
                  <FiTrash2 size={22} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="sm">
          <div className="p-6">
            <h3 className="text-lg font-bold text-[#613d20] mb-4">Exclusão Bloqueada</h3>
            <p className="text-gray-700 text-base">
              A exclusão foi bloqueada porque esta promoção ainda está ativa.
              <br />
              Por favor, desative-a antes de tentar excluí-la.
            </p>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-[#613d20] hover:bg-[
                #613d20] text-white font-medium transition"
              >
                Entendi
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showModalDel && (
        <Modal show={showModalDel} onClose={() => setShowModalDel(false)} maxWidth="sm">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Excluir Promoção</h2>
            <p className="text-gray-600">
              Você tem certeza que deseja excluir esta promoção? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModalDel(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
