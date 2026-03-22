import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// A página recebe a 'venda' como uma prop do controller
export default function Retirada({ venda }) {
  const totalPedido = parseFloat(venda.valor);

  // Controle do formulário pelo Inertia
  const { data, setData, post, processing } = useForm({
    forma_pagamento: 'dinheiro',
    valor_troco_para: '',
  });

  const valorPago = parseFloat(data.valor_troco_para || 0);
  let troco = 0;
  let valorInsuficiente = false;

  if (!isNaN(valorPago) && valorPago > 0) {
    if (valorPago >= totalPedido) {
      troco = valorPago - totalPedido;
    } else {
      valorInsuficiente = true;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('venda.pagamentoRetirada', venda.id), {
      onSuccess: () => {
        window.location.href = route('meus.pedidos');
      },
      onError: (errors) => {
        console.error(errors);
        alert('Ocorreu um erro ao confirmar seu pedido. Tente novamente.');
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Confirmar Pedido #${venda.id}`} />

      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center text-[#613d20] mb-6">Confirmar Pagamento na Retirada</h1>

        <div className="bg-white p-6 rounded-xl border shadow space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Resumo do Pedido #{venda.id}</h2>

          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">Itens:</p>
            <ul className="space-y-2 text-sm text-gray-800">
              {venda.produtos.map((produto, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <span>{produto.quantity}x {produto.nome}</span>
                  <span>R$ {Number(produto.preco * produto.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 text-right">
            <p className="text-lg font-bold text-gray-900">
              Total a pagar: R$ {totalPedido.toFixed(2)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 border-t pt-6 space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Como você gostaria de pagar na retirada?</label>
              <div className="flex flex-col sm:flex-row gap-4">
                {['dinheiro', 'cartao', 'pix'].map((metodo) => (
                  <label key={metodo} className="flex items-center p-3 border rounded-lg cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="forma_pagamento"
                      value={metodo}
                      checked={data.forma_pagamento === metodo}
                      onChange={(e) => setData('forma_pagamento', e.target.value)}
                      className="w-5 h-5 text-[#613d20] focus:ring-[#8a5a33]"
                    />
                    <span className="ml-3 font-medium capitalize">{metodo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* CAMPO CONDICIONAL PARA DINHEIRO E CÁLCULO DE TROCO */}
            {data.forma_pagamento === 'dinheiro' && (
              <div>
                <label htmlFor="valorDinheiro" className="block font-semibold text-gray-700 mb-2">
                  Valor que será pago em dinheiro:
                </label>
                <input
                  id="valorDinheiro"
                  type="number"
                  step="0.01"
                  min={totalPedido}
                  value={data.valor_troco_para}
                  onChange={(e) => setData('valor_troco_para', e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder={`Valor (ex: 50.00)`}
                />

                {valorInsuficiente && (
                  <p className="mt-2 text-red-600 text-sm font-semibold">
                    O valor pago deve ser igual ou maior que o total do pedido.
                  </p>
                )}

                {troco > 0 && (
                  <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-lg text-center">
                    <span className="font-semibold">Troco: R$ {troco.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-[#613d20] hover:bg-[#8a5a33] text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
            >
              {processing ? 'Confirmando...' : 'Confirmar Pedido e Pagar na Retirada'}
            </button>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
