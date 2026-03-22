import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef } from 'react';

export default function VendasLayout() {
  const { vendas, usuarios } = usePage().props;

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [filtroData, setFiltroData] = useState('todos');
  const [buscaNome, setBuscaNome] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [search, setSearch] = useState("");

  const gerarMensagemWhatsApp = (pedido) => {
    let mensagem = `📦 Olá, ${pedido.nome}!\n\n`;

    const mensagensStatus = {
      iniciado: "Seu pedido foi iniciado, aguardando confirmação do pagamento. 💳",
      pago: "Pagamento confirmado! 🎉 Seu pedido já está sendo processado.",
      em_preparo: "Seu pedido está em preparo na cozinha. 👩‍🍳🍫",
      em_entrega: "Seu pedido saiu para entrega. 🚚💨",
      entregue: "Pedido entregue com sucesso! ✅ Obrigado pela preferência. 💖",
      falha_pagamento: "⚠️ Ocorreu uma falha no pagamento. Verifique e tente novamente.",
      default: "Seu pedido foi recebido com sucesso. 🙌",
    };

    mensagem += mensagensStatus[pedido.status] || mensagensStatus.default;
    mensagem += `\nStatus atual: *${pedido.status.toUpperCase()}*\n\n`;

    mensagem += `🧾 Detalhes do Pedido:\n`;
    pedido.produtos.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.nome} - ${item.quantity}x R$ ${parseFloat(item.preco).toFixed(2)}\n`;
    });

    mensagem += `\n💰 Total: R$ ${parseFloat(pedido.valor).toFixed(2)}`;

    if (pedido.tipo === "entrega") {
      mensagem += `\n\n🚚 Endereço de entrega:\n${pedido.rua}, ${pedido.numero}\n${pedido.bairro} - ${pedido.cidade}/${pedido.estado}\nCEP: ${pedido.cep}`;
    } else {
      mensagem += `\n\n🏬 Retirada na loja.`;
      if (pedido.forma_pagamento === 'dinheiro' && pedido.valor_troco_para) {
        mensagem += `\n💵 Troco para: R$ ${parseFloat(pedido.valor_troco_para).toFixed(2)}`;
      }
    }

    if (pedido.status !== "falha_pagamento") {
      mensagem += `\n\n✅ Em breve você receberá novas atualizações do seu pedido!`;
    }

    return encodeURIComponent(mensagem);
  };

  const previousVendasCount = useRef(vendas.length);

  useEffect(() => {
    if (vendas.length > previousVendasCount.current) {
      const audio = new Audio('/sounds/notification.mp3'); 
      audio.play().catch(error => {
        console.error("Erro ao tocar o som de notificação:", error);
      });
    }
    previousVendasCount.current = vendas.length;
  }, [vendas]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ 
        only: ['vendas'],
        preserveState: true,
        preserveScroll: true,
      });
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const statusDisponiveis = [
    'todos', 'iniciado', 'pago', 'em_preparo', 'em_entrega', 'entregue', 'falha_pagamento',
  ];

  const nomesStatus = {
    todos: 'Todos', iniciado: 'Iniciado', pago: 'Pago', em_preparo: 'Em Preparo',
    em_entrega: 'Em Entrega', entregue: 'Entregue', falha_pagamento: 'Falha/Pendente',
  };

  const avancarStatus = (vendaId, novoStatus) => {
    router.post(`/admin/vendas/${vendaId}/status`, { status: novoStatus }, {
        preserveScroll: true, preserveState: true, only: ['vendas'],
    });
  };

  const cancelarPedido = (pedidoId) => {
    router.post(`/admin/vendas/${pedidoId}/cancelar`, {}, {
        preserveScroll: true, preserveState: true, only: ['vendas'],
    });
  };

  const coresStatus = {
    pago: 'bg-cyan-100 text-cyan-700', iniciado: 'bg-red-100 text-red-700',
    em_preparo: 'bg-yellow-100 text-yellow-700', em_entrega: 'bg-blue-100 text-blue-700',
    entregue: 'bg-green-100 text-green-700', falha_pagamento: 'bg-red-100 text-red-700',
  };

  const vendasFiltradas = useMemo(() => {
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);

    return vendas.filter((venda) => {
      const dataVenda = new Date(venda.created_at);
      if (dataSelecionada) {
        const dataVendaFormatada = dataVenda.toISOString().split('T')[0];
        if (dataVendaFormatada !== dataSelecionada) return false;
      }
      if (filtroData === 'hoje') {
        const hojeFormatada = hoje.toISOString().split('T')[0];
        const dataVendaFormatada = dataVenda.toISOString().split('T')[0];
        if (dataVendaFormatada !== hojeFormatada) return false;
      } else if (filtroData === '7dias') {
        if (dataVenda < seteDiasAtras) return false;
      }
      if (buscaNome.trim() !== '' && !venda.nome.toLowerCase().includes(buscaNome.toLowerCase())) return false;
      if (filtroStatus !== 'todos' && venda.status !== filtroStatus) return false;
      return true;
    });
  }, [vendas, filtroData, buscaNome, dataSelecionada, filtroStatus]);

  useEffect(() => {
    if (pedidoSelecionado) {
      localStorage.setItem('pedidoSelecionadoId', pedidoSelecionado.id);
    }
  }, [pedidoSelecionado]);

  useEffect(() => {
    const idSalvo = localStorage.getItem('pedidoSelecionadoId');
    if (vendasFiltradas.length > 0) {
      const vendaSalva = vendasFiltradas.find((v) => String(v.id) === idSalvo);
      setPedidoSelecionado(vendaSalva || vendasFiltradas[0]);
    } else {
      setPedidoSelecionado(null);
    }
  }, [vendasFiltradas]);

  const formatarFormaPagamento = (formaApi) => {
    const nomes = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'Pix',
      ticket: 'Boleto Bancário',
      account_money: 'Saldo Mercado Pago',
      bank_transfer: 'Transferência Bancária',
      cartao: 'Cartão',
      dinheiro: 'Dinheiro'
    };
    return nomes[formaApi] || formaApi || 'Não informado';
  };

  return (
    <AdminLayout>
      <Head title="Pedidos" />

      {/* Filtros */}
      <div className="max-w-6xl mx-auto mt-2 mb-6 px-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
            {['todos', 'hoje', '7dias'].map((tipo) => (
              <button key={tipo} onClick={() => setFiltroData(tipo)}
                className={`px-4 py-2 rounded-full font-semibold ${
                  filtroData === tipo ? 'bg-[#613d20] text-white' : 'bg-gray-200'
                }`}
              >
                {tipo === 'todos' ? 'Todos' : tipo === 'hoje' ? 'Hoje' : 'Últimos 7 dias'}
              </button>
            ))}
          </div>
          <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 w-full sm:w-auto"
          />
          <input type="text" placeholder="Buscar por nome do cliente..." value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)}
            className="px-4 py-2 rounded border border-[#8a5a33] w-full sm:max-w-xs"
          />
        </div>
        <div className="w-full flex flex-wrap gap-2 border-t pt-4 mt-4">
          {statusDisponiveis.map((status) => (
            <button key={status} onClick={() => setFiltroStatus(status)}
              className={`px-3 py-1 text-sm rounded-full font-semibold transition-colors ${
                filtroStatus === status
                  ? 'bg-[#613d20] text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {nomesStatus[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 max-w-6xl mx-auto">
        {/* Lista lateral */}
        <div className="w-full lg:w-1/3 space-y-4 max-h-[70vh] overflow-y-auto">
          {vendasFiltradas.length > 0 ? (
            vendasFiltradas.map((venda) => (
              <div   key={venda.id}
    onClick={() => setPedidoSelecionado(venda)}
    className={`p-4 rounded-xl shadow cursor-pointer border transition ${
      pedidoSelecionado?.id === venda.id
        ? 'bg-white border-[#613d20] ring-2 ring-[#613d20]'
        : 'bg-gray-50 border border-[#e5e5e5] hover:border-[#8a5a33] hover:bg-white'
    }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800">{venda.nome}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${coresStatus[venda.status] || 'bg-gray-100 text-gray-700'}`}>
                    {venda.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Pedido feito: {new Date(venda.created_at).toLocaleDateString('pt-BR')} — #
                  {String(venda.id).padStart(5, '0')}
                </p>

              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Nenhuma venda encontrada para os filtros aplicados.
            </div>
          )}
        </div>

        {/* Painel da direita */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border-[#8a5a33] shadow space-y-4 max-h-[70vh] overflow-y-auto">
          {pedidoSelecionado ? (
            <>
              <h2 className="text-xl font-bold mb-2 text-[#613d20]">
                Pedido #{String(pedidoSelecionado.id).padStart(5, '0')}
              </h2>
              <p className="text-sm text-gray-700">
                Horário: {new Date(pedidoSelecionado.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="text-[#613d20]"><strong>Cliente:</strong> <span className="font-medium">{pedidoSelecionado.nome}</span></p>
                <p className="text-[#613d20]"><strong>Contato:</strong> <span className="font-medium">{pedidoSelecionado.telefone}</span></p>
                <p className="text-[#613d20]"><strong>Tipo:</strong> <span className="font-medium">{pedidoSelecionado.tipo}</span></p>
              </div>

              {pedidoSelecionado.tipo === 'entrega' && (
                <div className="text-sm text-gray-800 space-y-1">
                  <p className="font-semibold mt-2 text-[#613d20]">Endereço de Entrega</p>
                  <p className="font-medium">{pedidoSelecionado.rua}, {pedidoSelecionado.numero}</p>
                  <p className="font-medium">{pedidoSelecionado.bairro} - {pedidoSelecionado.cidade}/{pedidoSelecionado.estado}</p>
                  <p className="font-medium">{pedidoSelecionado.cep}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-sm text-[#613d20] mb-1">Itens do Pedido</p>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {pedidoSelecionado.produtos.map((produto, index) => (
                    <li key={index}>
                      {produto.quantity}x {produto.nome} {produto?.id_promocao && "(PROMO)"}
                      {produto.id_promocao && produto.kitquantity > 1 && (
                        <div className="mt-1 text-xs text-blue-600">(Kit com {produto.kitquantity} unidades)</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm text-gray-700">
                <p className="mt-2 text-[#613d20]"><strong>Pagamento:</strong> {formatarFormaPagamento(pedidoSelecionado?.forma_pagamento)}</p>
                {pedidoSelecionado.forma_pagamento === 'dinheiro' && pedidoSelecionado.valor_troco_para && (
                  <div>
                  <p className="text-[#613d20]"><strong>Troco para:</strong> R$ {parseFloat(pedidoSelecionado.valor_troco_para).toFixed(2)}</p>
                   <p className="text-[#613d20]"><strong>Troco:</strong> R$ {(parseFloat(pedidoSelecionado.valor_troco_para).toFixed(2)-parseFloat(pedidoSelecionado.valor).toFixed(2))}</p>
                  </div>
                )}
                <p className="text-[#613d20]"><strong>Total:</strong> R$ {parseFloat(pedidoSelecionado.valor).toFixed(2)}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex gap-4 items-center">
                  <select value={pedidoSelecionado.status} onChange={(e) => avancarStatus(pedidoSelecionado.id, e.target.value)} className="border px-4 py-2 rounded">
                    <option value="iniciado">Iniciado</option>
                    <option value="em_preparo">Em Preparo</option>
                    <option value="em_entrega">Em Entrega</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </div>
                <a
                  href={`https://wa.me/55${pedidoSelecionado.telefone.replace(/\D/g, '')}?text=${gerarMensagemWhatsApp(pedidoSelecionado)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow font-semibold"
                >
                  Enviar WhatsApp
                </a>
                {pedidoSelecionado.status !== 'entregue' && pedidoSelecionado.status !== 'cancelado' && (
                  <button onClick={() => cancelarPedido(pedidoSelecionado.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow font-semibold"
                  >
                    DESCARTAR
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Selecione um pedido para ver os detalhes</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
