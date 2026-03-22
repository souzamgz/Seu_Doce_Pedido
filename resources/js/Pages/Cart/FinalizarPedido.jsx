import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function FinalizarPedido({
  tipoPedido,
  setTipoPedido,
  informacoes,
  botao,
  setBotao,
  enderecoSelecionado,
  setEnderecoSelecionado,
  enderecoTemporario,
  setEnderecoTemporario
}) {
  const camposObrigatorios = ['rua', 'numero', 'bairro', 'cidade', 'estado', 'telefone'];
  const campoObrigatorio = ['telefone'];
  const user = usePage().props.auth.user;
  const enderecosSalvos = usePage().props.auth.enderecos || [];

  // Função que verifica se algum campo obrigatório está faltando
  const algumCampoFaltando = () => {
    if (tipoPedido === 'entrega') {
      const enderecoAtual = enderecoSelecionado || enderecoTemporario;
      if (!enderecoAtual) return true;
      return camposObrigatorios.some(campo => {
        const valorEndereco = enderecoAtual[campo]?.toString().trim();
        const valorInformacoes = informacoes?.[campo]?.toString().trim();
        return !valorEndereco && !valorInformacoes; // true se ambos vazios
      });
    }
    return false;
  };

  const campofaltando = campoObrigatorio.some(
    campo => !informacoes?.[campo]?.trim()
  );

  // Atualiza estado do botão
  useEffect(() => {
    if (user.admin) {
      setBotao(false);
    } else if (
      (algumCampoFaltando() && tipoPedido === 'entrega') ||
      (campofaltando && tipoPedido === 'retirada')
    ) {
      setBotao(true);
    } else {
      setBotao(false);
    }
  }, [informacoes, tipoPedido, enderecoSelecionado, enderecoTemporario]);

  // Atualiza campos do endereço temporário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnderecoTemporario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

 const buscarCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const enderecoApi = await response.json();

    if (!enderecoApi.erro && enderecoTemporario) {
      setEnderecoTemporario(prev => ({
        ...prev,
        rua: enderecoApi.logradouro || '',
        bairro: enderecoApi.bairro || '',
        cidade: enderecoApi.localidade || '',
        estado: enderecoApi.uf || ''
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar CEP", error);
  }
};



  return (
    <div className="mb-4">
      <fieldset>
        <legend className="font-semibold mb-2">Tipo de pedido:</legend>
        <label className="inline-flex items-center mr-6 cursor-pointer">
          <input
            type="radio"
            name="tipoPedido"
            value="retirada"
            checked={tipoPedido === 'retirada'}
            onChange={e => setTipoPedido(e.target.value)}
          />
          <span className="ml-2">Retirada</span>
        </label>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name="tipoPedido"
            value="entrega"
            checked={tipoPedido === 'entrega'}
            onChange={e => setTipoPedido(e.target.value)}
          />
          <span className="ml-2">Entrega</span>
        </label>
      </fieldset>

      {tipoPedido === 'entrega' && (
        <>
          {algumCampoFaltando() && !user.admin && (
            <div className="mt-3 p-3 border rounded bg-yellow-100 text-yellow-800">
              ⚠️ Há informações de entrega incompletas. Por favor, revise os dados abaixo. <br />
              <Link
                href="/profile#infos"
                className="mt-2 inline-block text-sm underline text-blue-600 hover:text-blue-800"
              >
                👉 Clique aqui para preencher as informações no seu perfil
              </Link>
            </div>
          )}

          <div className="mt-3 p-3 border rounded bg-gray-50 space-y-2">
            {/* Endereços salvos */}
            {enderecosSalvos.map((end, i) => (
              <label
                key={i}
                className="flex items-center border p-2 rounded cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name="enderecoSelecionado"
                  checked={enderecoSelecionado?.id === end.id}
                  onChange={() => {
                    setEnderecoSelecionado(end);
                    setEnderecoTemporario(null);
                  }}
                  className="w-4 h-4 text-[#613d20]"
                />
                <span className="ml-2">
                  {end.nome_perfil} {end.is_principal ? '(Principal)' : ''}
                </span>
              </label>
            ))}

            {/* Endereço temporário */}
            {enderecoTemporario ? (
              <div className="border p-3 rounded bg-white grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="rua"
                  placeholder="Rua"
                  value={enderecoTemporario.rua || ''}
                  onChange={handleChange}
                  className="border p-2 rounded col-span-2"
                />
                <input
                  type="text"
                  name="numero"
                  placeholder="Número"
                  value={enderecoTemporario.numero || ''}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="bairro"
                  placeholder="Bairro"
                  value={enderecoTemporario.bairro || ''}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="cidade"
                  placeholder="Cidade"
                  value={enderecoTemporario.cidade || ''}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="estado"
                  placeholder="Estado"
                  value={enderecoTemporario.estado || ''}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
  <input
  id="cep"
  name="cep"
  placeholder="Digite o CEP"
  value={enderecoTemporario?.cep || ''}
  onChange={handleChange}
  onBlur={e => buscarCep(e.target.value)}
  className="border rounded p-2 w-full"
/>


                <input
                  type="text"
                  name="complemento"
                  placeholder="Complemento"
                  value={enderecoTemporario.complemento || ''}
                  onChange={handleChange}
                  className="border p-2 rounded col-span-2"
                />
                <input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={enderecoTemporario.telefone || informacoes?.telefone || ''}
                  onChange={handleChange}
                  className="border p-2 rounded col-span-2"
                />
              </div>
            ) : enderecoSelecionado ? (

               <div className="mt-3 p-3 border rounded bg-gray-50">
    <p><strong>Rua:</strong> {enderecoSelecionado.rua}</p>
    <p><strong>Número:</strong> {enderecoSelecionado.numero}</p>
    <p><strong>Bairro:</strong> {enderecoSelecionado.bairro}</p>
    <p><strong>Cidade:</strong> {enderecoSelecionado.cidade}</p>
    <p><strong>Estado:</strong> {enderecoSelecionado.estado}</p>
    <p><strong>CEP:</strong> {enderecoSelecionado.cep}</p>
    <p><strong>Complemento:</strong> {enderecoSelecionado.complemento || '-'}</p>
    <p><strong>Telefone:</strong> {informacoes?.telefone || 'Não informado'}</p>
  </div>

            ) : null}

            {/* Botão adicionar endereço temporário */}
            <button
              type="button"
              onClick={() => {
                setEnderecoTemporario({
                  rua: '',
                  numero: '',
                  bairro: '',
                  cidade: '',
                  estado: '',
                  cep: '',
                  complemento: '',
                  telefone: informacoes?.telefone || '',
                });
                setEnderecoSelecionado(null);
              }}
              className="mt-2 text-sm font-semibold text-[#613d20] hover:text-[#8a5a33]"
            >
              + Usar outro endereço
            </button>
          </div>
        </>
      )}

      {/* Aviso para retirada */}
      {tipoPedido === 'retirada' && (!informacoes?.telefone || campofaltando) && (
        <div className="mt-3 p-3 border rounded bg-yellow-100 text-yellow-800">
          ⚠️ Há informações para retirada incompletas. Por favor, revise os dados abaixo:
          <div className="mt-2 bg-gray-50 p-2 border rounded">
            <p>
              <strong>Telefone:</strong> {informacoes?.telefone || 'Não informado'}
            </p>
          </div>
          <Link
            href="/profile#infos"
            className="mt-2 inline-block text-sm underline text-blue-600 hover:text-blue-800"
          >
            👉 Clique aqui para preencher os dados no seu perfil
          </Link>
        </div>
      )}
    </div>
  );
}
