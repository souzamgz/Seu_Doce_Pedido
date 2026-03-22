import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

export default function MeusCupons() {
  const { auth } = usePage().props; // pega auth do Inertia
  const cupons = auth?.cupons || []; // cupons vinculados ao usuário

  console.log(cupons)

  const [cuponsAtivos, setCuponsAtivos] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [selectedCupom, setSelectedCupom] = useState(null);

  useEffect(() => {
  if (cupons) {
    // Filtra apenas cupons ativos e que ainda não atingiram o limite de uso
    const ativos = cupons.filter(c => 
      c.ativo && (
        !c.limite_usos || 
        (c.pivot?.usos ?? 0) < c.limite_usos
      )
    );

    setCuponsAtivos(ativos);

    if (ativos.length > 0 && !selectedCupom) {
      setSelectedCupom(ativos[0]);
    }
  }
}, [cupons]);


  const aplicarCupom = (e) => {
    e.preventDefault();
    if (!codigo) return;

    router.post('/cupons/aplicar', { codigo }, {
      onSuccess: () => {
        setMensagem('Cupom aplicado com sucesso!');
        setCodigo('');
      },
      onError: (errors) => {
        setMensagem(errors.codigo || 'Erro ao aplicar cupom');
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Meus Cupons" />

      <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 max-w-6xl mx-auto">
        {/* Lista de cupons */}
        <div className="w-full lg:w-1/3 space-y-4 max-h-[80vh] overflow-y-auto">
          {cuponsAtivos.length > 0 ? cuponsAtivos.map(cupom => (
            <div
              key={cupom.id}
              onClick={() => setSelectedCupom(cupom)}
              className={`p-4 rounded-xl shadow cursor-pointer border hover:bg-white transition ${
                selectedCupom?.id === cupom.id ? 'bg-white ring-2 ring-[#613d20]' : 'bg-gray-50 border-transparent'
              }`}
            >
              <p className="font-bold text-[#613d20] text-lg">{cupom.codigo}</p>
              <p className="text-sm text-gray-600">{cupom.descricao}</p>
              <p className="text-sm mt-1 text-[#613d20] font-semibold">
                {cupom.tipo_desconto === 'percentual' 
                  ? `${cupom.valor_desconto}%` 
                  : `R$ ${parseFloat(cupom.valor_desconto).toFixed(2)}`}
              </p>
            </div>
          )) : (
            <p className="text-gray-500 text-center">Nenhum cupom ativo.</p>
          )}
        </div>

        {/* Detalhes do cupom / Formulário de código */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border shadow space-y-4 max-h-[80vh] overflow-y-auto">
          {selectedCupom ? (
            <>
              <h2 className="text-xl font-bold text-[#613d20] mb-2">{selectedCupom.codigo}</h2>
              <p className="text-sm text-gray-600 mb-1">{selectedCupom.descricao}</p>
              <p className="text-sm text-[#613d20] font-semibold">
                Desconto: {selectedCupom.tipo_desconto === 'percentual' 
                  ? `${selectedCupom.valor_desconto}%` 
                  : `R$ ${parseFloat(selectedCupom.valor_desconto).toFixed(2)}`}
              </p>

              {selectedCupom.valor_minimo && (
                <p className="text-sm text-gray-600">Valor mínimo: R$ {parseFloat(selectedCupom.valor_minimo).toFixed(2)}</p>
              )}

              <p className="text-sm text-gray-600">
                Validade: {new Date(selectedCupom.data_inicio).toLocaleDateString('pt-BR')} até {selectedCupom.data_fim ? new Date(selectedCupom.data_fim).toLocaleDateString('pt-BR') : 'indefinida'}
              </p>
            </>
          ) : (
            <p className="text-gray-500">Selecione um cupom para ver os detalhes.</p>
          )}

          <div className="border-t pt-4 mt-4">
            <h3 className="text-[#613d20] font-semibold mb-2">Aplicar novo cupom</h3>
            <form onSubmit={aplicarCupom} className="flex flex-col gap-3">
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="Digite o código do cupom"
                className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#613d20]"
                required
              />
              <button type="submit" className="w-full py-2 bg-[#8a5a33] hover:bg-[#613d20] text-white font-semibold rounded-xl shadow-lg transition">
                Aplicar Cupom
              </button>
              {mensagem && <p className="text-sm text-center text-green-600">{mensagem}</p>}
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
