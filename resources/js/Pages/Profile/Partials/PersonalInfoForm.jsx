import { useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PersonalInfoForm() {
  const user = usePage().props.auth.user;


  const hash = window.location.hash;
  // Form inicial
  const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
    enderecos: user.enderecos && user.enderecos.length > 0 ? user.enderecos : [
      { id: null, nome_perfil: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '', complemento: '', is_principal: true }
    ],
    hash: hash || null,
    cpf: user.informacoes_pessoais?.cpf || '',
    telefone: user.informacoes_pessoais?.telefone || '',
  });

  const [abaAtiva, setAbaAtiva] = useState(0);

  const Inertia = router;

  

  useEffect(() => {
    const indexPrincipal = data.enderecos.findIndex(end => end.is_principal);
    setAbaAtiva(indexPrincipal !== -1 ? indexPrincipal : 0);

  }, []);

  // Adiciona novo endereço
  const adicionarEndereco = () => {
    const novosEnderecos = [
      ...data.enderecos,
      { id: null, rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '', complemento: '', is_principal: false }
    ];
    setData('enderecos', novosEnderecos);
    setAbaAtiva(novosEnderecos.length - 1);
  };

  // Remove endereço
const removerEndereco = (id) => {
  if (confirm('Tem certeza que deseja remover este endereço?')) {
    router.delete(route('informacoes.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        setData('enderecos', data.enderecos.filter(end => end.id !== id));
        setAbaAtiva(0);
      },
      onError: () => {
        alert('Erro ao remover o endereço.');
      },
      onFinish: () => {
        clearErrors();
        reset();
      },
    });
  }
};

  // Atualiza campo do endereço
  const handleEnderecoChange = (index, e) => {
    const { name, value } = e.target;
    const novosEnderecos = [...data.enderecos];
    novosEnderecos[index][name] = value;
    setData('enderecos', novosEnderecos);
  };

  // Define endereço principal
  const setEnderecoPrincipal = (index) => {
    const novosEnderecos = data.enderecos.map((end, i) => ({ ...end, is_principal: i === index }));
    setData('enderecos', novosEnderecos);
  };

  // Busca CEP
  const buscarCep = async (cep, index) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const enderecoApi = await response.json();
      const novosEnderecos = [...data.enderecos];
      if (!enderecoApi.erro) {
        novosEnderecos[index] = {
          ...novosEnderecos[index],
          rua: enderecoApi.logradouro || '',
          bairro: enderecoApi.bairro || '',
          cidade: enderecoApi.localidade || '',
          estado: enderecoApi.uf || ''
        };
      }
      setData('enderecos', novosEnderecos);
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
  };

  // Submit flat (sem array)
  const submit = (e) => {
    e.preventDefault();


     const payload = {  
    telefone: data.telefone,
    cpf: data.cpf,
    hash: hash || null,
    enderecos: data.enderecos.map(end => ({
      id: end.id, // null se for novo
      nome_perfil: end.nome_perfil,
      rua: end.rua,
      numero: end.numero,
      bairro: end.bairro,
      cidade: end.cidade,
      estado: end.estado,
      cep: end.cep,
      complemento: end.complemento,
      is_principal: end.is_principal

    }))
  };

    post(route('informacoes.storeOrUpdate'), {
       data: payload, 
       preserveScroll: true ,
      onSuccess: () => {
      if (payload.hash) {
        router.visit(route('CarrinhoDeCompra'), { preserveState: true });
      }
    }
      });
  };

  return (
    <section className="mt-6">
      <header>
        <h2 className="text-lg font-bold text-[#613d20]">Informações Pessoais</h2>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie seus endereços de entrega, telefone e CPF.
        </p>
      </header>
      <form onSubmit={submit} className="mt-6 space-y-6">
        {/* TELEFONE + CPF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="Telefone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone <span className="text-red-500">*</span>
           </label>
            <input
              placeholder="Telefone"
              value={data.telefone}
              onChange={e => setData('telefone', e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
            {errors.telefone && <p className="text-red-500 text-xs">{errors.telefone}</p>}
          </div>
          <div>
            <label htmlFor="CPF" className="block text-sm font-medium text-gray-700 mb-1">
            CPF
           </label>
            <input
              placeholder="CPF"
              value={data.cpf}
              onChange={e => setData('cpf', e.target.value)}
              className="border rounded p-2 w-full"
            />
            {errors.cpf && <p className="text-red-500 text-xs">{errors.cpf}</p>}
          </div>
        </div>

        {/* ENDEREÇOS */}
        <div className="border-t pt-6">
          <h2 className="text-md font-semibold text-gray-800 mb-3">Meus Endereços</h2>
          <div className="flex flex-wrap items-center gap-2 border-b mb-4">
            {data.enderecos.map((endereco, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setAbaAtiva(index)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${abaAtiva === index ? 'bg-white border-b-2 border-transparent' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                {endereco.nome_perfil} {endereco.is_principal ? '(Principal)' : ''}
              </button>
            ))}
            <button
              type="button"
              onClick={adicionarEndereco}
              className="ml-auto text-sm font-semibold text-[#613d20] hover:text-[#8a5a33] px-3 py-1 bg-gray-100 rounded-md"
            >
              + Adicionar
            </button>
          </div>

          {/* FORM DE ENDEREÇO */}
          <div className="p-4 border rounded-lg space-y-4 relative bg-gray-50">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
  <label htmlFor={`nome_perfil-${abaAtiva}`} className="block text-sm font-medium text-gray-700 mb-1">
    Nome do Perfil-Endereço <span className="text-red-500">*</span>
  </label>
  <input
    id={`nome_perfil-${abaAtiva}`}
    name="nome_perfil"
    placeholder="Ex: Casa, Trabalho"
    value={data.enderecos[abaAtiva]?.nome_perfil || ''}
    onChange={e => handleEnderecoChange(abaAtiva, e)}
    className="border rounded p-2 w-full"
    required
  />
</div>

  {/* CEP */}
  <div>
    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
      CEP <span className="text-red-500">*</span>
    </label>
    <input
      id="cep"
      name="cep"
      placeholder="Digite o CEP"
      value={data.enderecos[abaAtiva]?.cep || ''}
      onChange={e => handleEnderecoChange(abaAtiva, e)}
      onBlur={e => buscarCep(e.target.value, abaAtiva)}
      className="border rounded p-2 w-full"
      required
    />
  </div>

  {/* Rua */}
  <div>
    <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
      Rua <span className="text-red-500">*</span>
    </label>
    <input
      id="rua"
      name="rua"
      placeholder="Nome da rua"
      value={data.enderecos[abaAtiva]?.rua || ''}
      onChange={e => handleEnderecoChange(abaAtiva, e)}
      className="border rounded p-2 w-full"
      required
    />
  </div>

  {/* Número */}
  <div>
    <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
      Número <span className="text-red-500">*</span>
    </label>
    <input
      id="numero"
      name="numero"
      placeholder="Número"
      value={data.enderecos[abaAtiva]?.numero || ''}
      onChange={e => handleEnderecoChange(abaAtiva, e)}
      className="border rounded p-2 w-full"
      required
    />
  </div>

  {/* Bairro */}
  <div>
    <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
      Bairro <span className="text-red-500">*</span>
    </label>
    <input
      id="bairro"
      name="bairro"
      placeholder="Bairro"
      value={data.enderecos[abaAtiva]?.bairro || ''}
      onChange={e => handleEnderecoChange(abaAtiva, e)}
      className="border rounded p-2 w-full"
      required
    />
  </div>

  {/* Cidade */}
  <div>
    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
      Cidade <span className="text-red-500">*</span>
    </label>
    <input
      id="cidade"
      name="cidade"
      placeholder="Cidade"
      value={data.enderecos[abaAtiva]?.cidade || ''}
      onChange={e => handleEnderecoChange(abaAtiva, e)}
      className="border rounded p-2 w-full"
      required
    />
  </div>

  {/* Estado */}
  <div>
    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
      Estado <span className="text-red-500">*</span>
    </label>
    <input
      id="estado"
      name="estado"
      placeholder="Estado"
      value={data.enderecos[abaAtiva]?.estado || ''}
      onChange={e => handleEnderecoChange(abaAtiva, e)}
      className="border rounded p-2 w-full"
      required
    />
  </div>

  {/* Complemento (linha inteira) */}
  <div className="sm:col-span-2">
    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
      Complemento
    </label>
    <input
      id="complemento"
      name="complemento"
      placeholder="Apartamento, bloco, referência..."
      value={data.enderecos[abaAtiva]?.complemento || ''}
      onChange={e => handleEnderecoChange(abaAtiva, e)}
      className="border rounded p-2 w-full"
    />
  </div>
</div>


            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  id={`principal-${abaAtiva}`}
                  name="endereco_principal"
                  checked={data.enderecos[abaAtiva]?.is_principal}
                  onChange={() => setEnderecoPrincipal(abaAtiva)}
                  className="w-4 h-4 text-[#613d20] focus:ring-[#8a5a33]"
                />
                <label htmlFor={`principal-${abaAtiva}`} className="ml-2 text-sm font-medium text-gray-700">
                  Usar como principal
                </label>
              </div>
              {data.enderecos.length > 1 && (
               <button
  type="button"
  onClick={() => removerEndereco(data.enderecos[abaAtiva].id)}
  className="text-sm text-red-500 hover:text-red-700 font-semibold"
>
  Remover este endereço
</button>
              )}
            </div>
          </div>
        </div>

        {/* BOTÃO SALVAR */}
        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={processing}
            className="bg-[#613d20] text-white px-4 py-2 rounded hover:bg-[#8a5a33]"
          >
            Salvar Informações
          </button>
          {recentlySuccessful && <p className="text-green-600 text-sm mt-2">Informações salvas com sucesso!</p>}
        </div>
      </form>
    </section>
  );
}
