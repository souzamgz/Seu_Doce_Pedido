import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useState, useEffect } from 'react'; // useEffect foi adicionado aqui

export default function DashboardAdmin() {
  const { auth, usuarios, shops, errors: pageErrors } = usePage().props;
  const user = auth.user;

const [horaAbertura, setHoraAbertura] = useState((shops.hora_abertura || '09:00:00').substring(0, 5));
const [horaFechamento, setHoraFechamento] = useState((shops.hora_fechamento || '18:00:00').substring(0, 5));
  const [lojaAberta, setLojaAberta] = useState(Boolean(shops.loja_aberta));
  const [search, setSearch] = useState('');

  const [diasFuncionamento, setDiasFuncionamento] = useState({
  funciona_domingo: Boolean(shops.funciona_domingo),
  funciona_segunda: Boolean(shops.funciona_segunda),
  funciona_terca: Boolean(shops.funciona_terca),
  funciona_quarta: Boolean(shops.funciona_quarta),
  funciona_quinta: Boolean(shops.funciona_quinta),
  funciona_sexta: Boolean(shops.funciona_sexta),
  funciona_sabado: Boolean(shops.funciona_sabado),
});
const handleDiaChange = (dia, valor) => {
  setDiasFuncionamento(prev => ({ ...prev, [dia]: valor }));
};

const salvarDiasFuncionamento = () => {
  router.post('/shop/atualizar', diasFuncionamento, {
    preserveScroll: true,
    onSuccess: () => alert('Dias de funcionamento atualizados!'),
    onError: () => alert('Erro ao salvar os dias de funcionamento.'),
  });
};

  const { data, setData, post, processing, errors } = useForm({
    telefone: shops.telefone || '',
    instagram : shops.instagram || '',
    email: shops.email || '',
    cep: shops.cep || '',
    rua: shops.rua || '',
    numero: shops.numero || '',
    bairro: shops.bairro || '',
    cidade: shops.cidade || '',
    estado: shops.estado || '',
    complemento: shops.complemento || '',
  });

  // FUNÇÃO PARA BUSCAR ENDEREÇO PELO CEP (VIA VIACEP)
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const endereco = await response.json();

      if (!endereco.erro) {
        setData((prevData) => ({
          ...prevData,
          rua: endereco.logradouro || '',
          bairro: endereco.bairro || '',
          cidade: endereco.localidade || '',
          estado: endereco.uf || '',
        }));
      } else {
        setData((prevData) => ({ ...prevData, rua: '', bairro: '', cidade: '', estado: '' }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // EFEITO PARA ACIONAR A BUSCA DO CEP AUTOMATICAMENTE
  useEffect(() => {
    if (data.cep.replace(/\D/g, '').length === 8) {
      buscarCep(data.cep);
    }
  }, [data.cep]);

  const toggleAdmin = (id) => {
    router.post(`/admin/toggle/${id}`), {
      preserveScroll: true
    
    };
   
  };

  const salvarInformacoesLoja = (e) => {
    e.preventDefault();
    post('/shop/atualizar', {
      preserveScroll: true,
      onSuccess: () => alert('Informações da loja atualizadas com sucesso!'),
      onError: () => alert('Erro ao salvar. Verifique os campos.'),
    });
  };

  const toggleLojaAberta = () => {
    const novoStatus = !lojaAberta;
    router.post('/shop/atualizar', { loja_aberta: novoStatus }, {
      onSuccess: () => setLojaAberta(novoStatus),
      preserveScroll: true
    });
    
  };

  const salvarHorarios = () => {
    router.post('/shop/atualizar', {
      hora_abertura: horaAbertura,
      hora_fechamento: horaFechamento,
      
    }, {
      preserveScroll: true,
      onSuccess: () => alert('Horários atualizados com sucesso!'),
      onError: (errors) => {
        alert('Erro ao salvar. Verifique os campos.');
        console.log(errors);
      },
    });
  };

  const filteredUsers = usuarios.data.filter((usuario) => {
    const termo = search.toLowerCase();
    return (
      usuario.name.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo)
    );
  });

  

  return (
    <AdminLayout>
      <Head title="Administração" />

      {/* Seção de Controle da Loja */}
      <section className="max-w-5xl w-full mx-auto mt-10 p-4 sm:p-6 bg-white rounded-3xl shadow-2xl space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-[#613d20] mb-6">Controle da Loja</h1>

        <form onSubmit={salvarInformacoesLoja} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefone" className="block font-semibold text-gray-700">Telefone / WhatsApp:</label>
              <input id="telefone" type="text" value={data.telefone} onChange={(e) => setData('telefone', e.target.value)} className="border border-gray-300 p-2 rounded w-full" placeholder="(99) 99999-9999"/>
              {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
            </div>
             <div>
              <label htmlFor="instagram" className="block font-semibold text-gray-700">Instagram:</label>
              <input id="instagram" type="text" value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} className="border border-gray-300 p-2 rounded w-full" placeholder="meuinstagram(sem @)"/>
              {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block font-semibold text-gray-700">E-mail de Contato:</label>
              <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="border border-gray-300 p-2 rounded w-full" placeholder="contato@sualoja.com"/>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
          <h2 className="text-xl font-bold text-[#613d20] border-t pt-6">Endereço da Loja</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="cep" className="block font-semibold text-gray-700">CEP:</label>
              <input id="cep" type="text" value={data.cep} onChange={(e) => setData('cep', e.target.value)} className="border border-gray-300 p-2 rounded w-full" placeholder="12345-678"/>
              {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="rua" className="block font-semibold text-gray-700">Rua:</label>
              <input id="rua" type="text" value={data.rua} onChange={(e) => setData('rua', e.target.value)} className="border border-gray-300 p-2 rounded w-full bg-gray-100" placeholder="Rua das Flores..." />
              {errors.rua && <p className="text-red-500 text-sm mt-1">{errors.rua}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="numero" className="block font-semibold text-gray-700">Número:</label>
              <input id="numero" type="text" value={data.numero} onChange={(e) => setData('numero', e.target.value)} className="border border-gray-300 p-2 rounded w-full" placeholder="123"/>
              {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
            </div>
            <div>
              <label htmlFor="bairro" className="block font-semibold text-gray-700">Bairro:</label>
              <input id="bairro" type="text" value={data.bairro} onChange={(e) => setData('bairro', e.target.value)} className="border border-gray-300 p-2 rounded w-full bg-gray-100" placeholder="Bairro das FLores..."/>
              {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro}</p>}
            </div>
            <div>
              <label htmlFor="complemento" className="block font-semibold text-gray-700">Complemento:</label>
              <input id="complemento" type="text" value={data.complemento} onChange={(e) => setData('complemento', e.target.value)} className="border border-gray-300 p-2 rounded w-full" placeholder="Sala 10, Bloco B"/>
              {errors.complemento && <p className="text-red-500 text-sm mt-1">{errors.complemento}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cidade" className="block font-semibold text-gray-700">Cidade:</label>
              <input id="cidade" type="text" value={data.cidade} onChange={(e) => setData('cidade', e.target.value)} className="border border-gray-300 p-2 rounded w-full bg-gray-100" placeholder="São Paulo..." />
              {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
            </div>
            <div>
              <label htmlFor="estado" className="block font-semibold text-gray-700">Estado:</label>
              <input id="estado" type="text" value={data.estado} onChange={(e) => setData('estado', e.target.value)} className="border border-gray-300 p-2 rounded w-full bg-gray-100" placeholder="Mogi Das Cruzes..." />
              {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
            </div>
          </div>
          <button type="submit" disabled={processing} className="w-full sm:w-auto bg-[#8a5a33] hover:bg-[#613d20] text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Salvar Informações da Loja
          </button>
        </form>

        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2 sm:gap-4">
              <p><strong>Loja aberta?</strong> {lojaAberta ? 'Sim' : 'Não'}</p>
              <button onClick={toggleLojaAberta} className={`px-6 py-2 rounded-full font-semibold text-white ${lojaAberta ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {lojaAberta ? 'Fechar Loja' : 'Abrir Loja'}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <div className="flex flex-col">
                <label className="block font-semibold mb-1">Hora de abertura:</label>
                <input type="time" value={horaAbertura} onChange={(e) => setHoraAbertura(e.target.value)} className="border px-3 py-2 rounded w-full sm:w-auto"/>
              </div>
              <div className="flex flex-col">
                <label className="block font-semibold mb-1">Hora de fechamento:</label>
                <input type="time" value={horaFechamento} onChange={(e) => setHoraFechamento(e.target.value)} className="border px-3 py-2 rounded w-full sm:w-auto"/>
              </div>
              <button onClick={salvarHorarios} className="w-full sm:w-auto bg-[#613d20] hover:bg-[#8a5a33] text-white px-6 py-2 rounded-full font-semibold">
                Salvar Horários
              </button>
            </div>
          </div>
        </div>
        {/* Cole este bloco de código dentro da <section> de Controle da Loja */}

<div className="border-t pt-6">
  <h2 className="text-xl font-bold text-[#613d20] mb-4">Dias de Funcionamento</h2>
  
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-4 text-center">
    {/* Mapeia o objeto de estado para criar um checkbox para cada dia */}
    {Object.keys(diasFuncionamento).map((diaKey) => {
      const nomeDia = diaKey.replace('funciona_', '');
      return (
        <label key={diaKey} className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
          <span className="font-medium text-gray-700 capitalize">{nomeDia}</span>
          <input
            type="checkbox"
            checked={diasFuncionamento[diaKey]}
            onChange={(e) => handleDiaChange(diaKey, e.target.checked)}
            className="mt-2 w-5 h-5 rounded text-[#613d20] focus:ring-[#8a5a33] border-gray-300"
          />
        </label>
      );
    })}
  </div>
  
  <button onClick={salvarDiasFuncionamento} className="w-full sm:w-auto bg-[#613d20] hover:bg-[#8a5a33] text-white px-6 py-2 rounded-full font-semibold">
    Salvar Dias de Funcionamento
  </button>
</div>
      </section>
      

      {/* Seção de Administração de Usuários */}
      <section className="max-w-5xl w-full mx-auto mt-12 p-4 sm:p-6 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-[#613d20] mb-6">
          Administração de Usuários
        </h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border border-[#8a5a33] focus:outline-none focus:ring-2 focus:ring-[#613d20]"
          />
        </div>
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full border-collapse">
            <thead className="bg-[#613d20] text-white hidden md:table-header-group">
              <tr>
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-center">Admin</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usuario) => (
                  <tr key={usuario.id} className="block md:table-row border-b border-[#613d20] mb-6 md:mb-0 p-4 md:p-0 rounded-lg bg-white md:bg-transparent">
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 break-words">
                      <span className="font-semibold md:hidden text-[#613d20]">Nome: </span>
                      {usuario.name}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 break-words max-w-xs truncate">
                      <span className="font-semibold md:hidden text-[#613d20]">Email: </span>
                      {usuario.email}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-center">
                      <span className="font-semibold md:hidden text-[#613d20]">Admin: </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${usuario.admin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {usuario.admin ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-center">
                      {usuario.id !== 1 ? (
                        <button onClick={() => toggleAdmin(usuario.id)} className={`w-full md:w-auto px-5 py-2 rounded-full text-sm font-semibold transition-colors ${usuario.admin ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                          {usuario.admin ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                      ) : (
                        <span className="text-gray-400 italic text-sm md:text-base">
                          Impossível Alterar
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block md:table-row p-4">
                  <td colSpan={4} className="text-center text-gray-500 py-6">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap justify-center mt-8 gap-4">
          {usuarios.prev_page_url && (
            <a href={usuarios.prev_page_url} className="flex items-center gap-2 px-5 py-2 bg-[#8a5a33] text-white rounded-full hover:bg-[#613d20] text-sm font-medium">
              <FiArrowLeft size={18} />
              Anterior
            </a>
          )}
          {usuarios.next_page_url && (
            <a href={usuarios.next_page_url} className="flex items-center gap-2 px-5 py-2 bg-[#8a5a33] text-white rounded-full hover:bg-[#613d20] text-sm font-medium">
              Próximo
              <FiArrowRight size={18} />
            </a>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}