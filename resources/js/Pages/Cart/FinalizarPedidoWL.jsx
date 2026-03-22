import {  useEffect } from 'react';

export default function FinalizarPedido({ tipoPedido, setTipoPedido, dadosEntrega, setDadosEntrega }) {
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
     let finalValue = value;
   
     const camposNumericos = ['telefone', 'cpf', 'numero', 'cep'];

      if (camposNumericos.includes(name)) {
      finalValue = value.replace(/\D/g, '');
    }
 setDadosEntrega(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // Função para buscar endereço pelo CEP usando ViaCEP
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cepLimpo.length !== 8) return; // Só busca se o CEP tiver 8 dígitos

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const endereco = await response.json();

      if (!endereco.erro) {
        setDadosEntrega(prev => ({
          ...prev,
          rua: endereco.logradouro || '',
          bairro: endereco.bairro || '',
          cidade: endereco.localidade || '',
          estado: endereco.uf || '',
        }));
      } else {
        // CEP não encontrado: limpa os campos de endereço
        setDadosEntrega(prev => ({
          ...prev,
          rua: '',
          bairro: '',
          cidade: '',
          estado: '',
        }));
      }
    } catch (error) {
      // Em caso de erro na requisição, limpa os campos
      setDadosEntrega(prev => ({
        ...prev,
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
      }));
    }
  };

  // useEffect para chamar buscarCep sempre que o cep mudar e tiver 8 números
  useEffect(() => {
    if (dadosEntrega.cep.replace(/\D/g, '').length === 8) {
      buscarCep(dadosEntrega.cep);
    }
  }, [dadosEntrega.cep]);

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
<div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
  <div>
    <label className="block text-sm font-semibold">Nome</label>
    <input
    required
      type="text"
      name="nome"
      value={dadosEntrega.nome}
      onChange={handleInputChange}
      className="w-full border px-3 py-2 rounded"
    />
  </div>
    <div>
            <label className="block text-sm font-semibold">Telefone</label>
            <input
            required
              type="text"
              name="telefone"
              value={dadosEntrega.telefone}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
           <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
            required
              type="text"
              name="email"
              value={dadosEntrega.email}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
           <div>
            <label className="block text-sm font-semibold">CPF</label>
            <input
              type="text"
              name="cpf"
              value={dadosEntrega.cpf}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          
</div>
      {tipoPedido === 'entrega' && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
          <div>
            <label className="block text-sm font-semibold">CEP</label>
            <input
              type="text"
              name="cep"
              value={dadosEntrega.cep}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              maxLength={9} // Se quiser formatar com traço
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Rua</label>
            <input
            required
              type="text"
              name="rua"
              value={dadosEntrega.rua}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Número</label>
            <input
            required
              type="text"
              name="numero"
              value={dadosEntrega.numero}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Bairro</label>
            <input
            required
              type="text"
              name="bairro"
              value={dadosEntrega.bairro}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Cidade</label>
            <input
            required
              type="text"
              name="cidade"
              value={dadosEntrega.cidade}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Estado</label>
            <input
            required
              type="text"
              name="estado"
              value={dadosEntrega.estado}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
