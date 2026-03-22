import { Head, usePage, router } from '@inertiajs/react';
import { FiX } from 'react-icons/fi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

export default function MeusPedidos() {
    const { vendas } = usePage().props;

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pedidoParaCancelar, setPedidoParaCancelar] = useState(null);
    const [pedidos, setPedidos] = useState([]);

    const abrirModalCancelar = (vendaId) => {
        setPedidoParaCancelar(vendaId);
        setShowModal(true);
    };

    const cancelarComRetorno = () => {
        router.post(`/meus-pedidos/${pedidoParaCancelar}/cancelar`, { retornar: true }, { preserveScroll: true });
        setShowModal(false);
    };

    const cancelarSemRetorno = () => {
        router.post(`/meus-pedidos/${pedidoParaCancelar}/cancelar`, { retornar: false }, { preserveScroll: true });
        setShowModal(false);
    };

    useEffect(() => {
        if (!vendas) return;
        const mappedVendas = vendas.map(venda => ({ ...venda, venda_id: venda.id }));
        setPedidos(mappedVendas);
        if (mappedVendas.length > 0 && !pedidoSelecionado) {
            setPedidoSelecionado(mappedVendas[0]);
        }
    }, [vendas]);

    const coresStatus = {
        pago: 'bg-cyan-100 text-cyan-700',
        iniciado: 'bg-red-100 text-red-700',
        em_preparo: 'bg-yellow-100 text-yellow-700',
        em_entrega: 'bg-blue-100 text-blue-700',
        entregue: 'bg-green-100 text-green-700',
        falha_pagamento: 'bg-red-100 text-red-700',
        cancelado: 'bg-gray-200 text-gray-700',
    };

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
        return nomes[formaApi] || formaApi?.replace('_', ' ') || 'Não informado';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Meus Pedidos" />

            {pedidos.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 max-w-6xl mx-auto">
                    {/* Lista lateral */}
                    <div className="w-full lg:w-1/3 space-y-4 max-h-[80vh] overflow-y-auto">
                        {pedidos.map((venda) => (
                            <div
                                key={venda.venda_id}
                                onClick={() => setPedidoSelecionado(venda)}
                                className={`p-4 rounded-xl shadow cursor-pointer border hover:bg-white transition ${
                                    pedidoSelecionado?.venda_id === venda.venda_id 
                                    ? 'bg-white ring-2 ring-[#613d20]' 
                                    : 'bg-gray-50 border-transparent'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-gray-800">
                                        Pedido #{String(venda.venda_id).padStart(5, '0')}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${coresStatus[venda.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {venda.status.replace('_', ' ')}
                                    </span>
                                </div>  

                                <p className="text-sm text-gray-600 mb-1">
                                    Forma de Pagamento: <strong>{formatarFormaPagamento(venda?.forma_pagamento || venda?.formapagamento)}</strong>
                                </p>
                                

                                <p className="text-sm text-gray-600">Feito em {new Date(venda.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                        ))}
                    </div>

                    {/* Detalhes do pedido */}
                    <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border shadow space-y-4 max-h-[80vh] overflow-y-auto">
                        {pedidoSelecionado ? (
                            <>
                                <h2 className="text-xl font-bold text-[#613d20] mb-2">Pedido #{String(pedidoSelecionado.venda_id).padStart(5, '0')}</h2>
                                <p className="text-sm text-gray-600 mb-1">Status: <strong className="capitalize">{pedidoSelecionado.status.replace('_', ' ')}</strong></p>

                                <p className="text-sm text-gray-600 mb-1">
                                    Forma de Pagamento: <strong>{formatarFormaPagamento(pedidoSelecionado?.forma_pagamento || pedidoSelecionado?.formapagamento)}</strong>
                                </p>

                                {(pedidoSelecionado?.forma_pagamento === 'dinheiro' || pedidoSelecionado?.formapagamento === 'dinheiro') && pedidoSelecionado?.valor_troco_para && (
                                    <p className="text-sm text-gray-600 mb-1">
                                        Troco para: <strong>R$ {parseFloat(pedidoSelecionado.valor_troco_para).toFixed(2)}</strong>
                                    </p>
                                )}

                                <p className="text-sm text-gray-600 mb-1">Tipo: <span className="capitalize">{pedidoSelecionado.tipo}</span></p>

                                {pedidoSelecionado.tipo === 'entrega' && (
                                    <div className="border-t pt-4 mt-4">
                                        <p className="font-semibold text-sm text-gray-700 mb-1">Endereço de Entrega:</p>
                                        <div className="text-sm text-gray-600">
                                            <p>{pedidoSelecionado.rua}, {pedidoSelecionado.numero}</p>
                                            {pedidoSelecionado.complemento && <p>{pedidoSelecionado.complemento}</p>}
                                            <p>{pedidoSelecionado.bairro}</p>
                                            <p>{pedidoSelecionado.cidade} - {pedidoSelecionado.estado}</p>
                                            <p>CEP: {pedidoSelecionado.cep}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4 mt-4 text-sm text-gray-700 text-[#613d20]">
                                    <p><strong>Total:</strong> R$ {parseFloat(pedidoSelecionado.valor).toFixed(2)}</p>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <p className="font-semibold text-sm text-[#613d20] mb-2">Produtos:</p>
                                    <ul className="space-y-2 text-sm text-gray-800">
                                        {pedidoSelecionado.produtos.map((produto, index) => (
                                            <li key={index} className="bg-gray-50 p-3 rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{produto.quantity}x {produto.nome}{produto?.id_promocao && "(PROMO)"}</span>
                                                   {/*
                                                    <span className="font-semibold">R$ {Number(produto.preco * produto.quantity).toFixed(2)}</span>
                                                    */}
                                                </div>

                                                {produto.id_promocao && produto.kitquantity > 1 && (
                                                    <div className="mt-1 text-xs text-blue-600">
                                                        (Kit com {produto.kitquantity} unidades)
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {pedidoSelecionado.status === 'iniciado' && pedidoSelecionado.payment_url && (
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <button onClick={() => abrirModalCancelar(pedidoSelecionado.venda_id)} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-Montserrat text-sm px-4 py-2 rounded-lg shadow transition-colors">
                                            Cancelar Pedido <FiX />
                                        </button>

                                        <a
                                            href={`/pagardepois/${pedidoSelecionado.id}`}
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 font-Montserrat bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-full transition justify-center"
                                        >
                                            Pagamento na Entrega
                                        </a>

                                        <a href={pedidoSelecionado.payment_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex font-Montserrat items-center justify-center gap-2 bg-[#613d20] hover:bg-[#8a5a33] text-white text-sm px-4 py-2 rounded-lg shadow transition-colors font-Montserrat font-extrabold">
                                            Realizar Pagamento
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500">Selecione um pedido para ver os detalhes.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p>Você ainda não realizou nenhuma compra.</p>
                    <p className="mt-2">Quando você fizer um pedido, ele aparecerá aqui.</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Cancelar Pedido</h2>
                        <p className="text-sm text-gray-600 mb-6">Deseja <strong>retornar os produtos ao carrinho</strong> ou apenas apagar o pedido?</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={cancelarComRetorno} className="w-full bg-[#613d20] hover:bg-[#8a5a33] text-white py-2 rounded-lg">
                                Sim, retornar os produtos
                            </button>
                            <button onClick={cancelarSemRetorno} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg">
                                Não, apenas apagar
                            </button>
                            <button onClick={() => setShowModal(false)} className="w-full text-sm text-gray-500 hover:underline mt-2">
                                Voltar
                            </button>
                        </div>
                    </div>
                    
                </div>
                
            )}
              <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Amor Com Recheio - Todos os direitos reservados
          </p>
        </div>
        </AuthenticatedLayout>
    );
}
