import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ChartNoAxesColumnIcon } from 'lucide-react';
import FinalizarPedidoWL from './FinalizarPedidoWL';

export default function CartWL() {
  const { cart = {}, products = [], promocoes = [], shop } = usePage().props;

  // Transforma o carrinho em uma lista renderizável
  const cartItems = cart && Object.entries(cart)
  .map(([key, item]) => {
    const isPromo = key.startsWith('promo_');
    const source = isPromo
      ? promocoes.find(promo => promo.id === parseInt(item.promo_id))
      : products.find(prod => prod.id === parseInt(item.product_id));

    if (!source) return null; // ignora se não achou o produto ou promoção

    return {
      key,
      isPromo,
      quantity: item.quantity,
      price: item.price,
      product: source
      
    };
  })
   .filter(item => item !== null); // remove entradas inválidas;



const total = cartItems?.length && cartItems.reduce((sum, item) => {
  return sum + item.product?.price * item.quantity;
}, 0);

  const [tipoPedido, setTipoPedido] = useState('retirada');
  const [dadosEntrega, setDadosEntrega] = useState({
    nome: '', cpf: '', rua: '', numero: '',
    bairro: '', cidade: '', estado: '', cep: '',
    telefone: '', email: ''
  });



const id = cartItems?.length && cartItems.find(item => !item.isPromo)?.product?.id || null;



  const form = useForm({ 
    products: cartItems?.length && cartItems.map(item => ({
      id: id,
      name: item.product?.name || item.product?.nome || item.product.product?.name ,
      description: item.product?.descricao || item.product.product?.descricao || '',
      quantity: item.quantity,
      price: item.product.product?.price || item.product?.price,
      imagem: item.product?.imagem || item.product.product?.imagem,
      isPromo: item.isPromo,
      kitquantity : item.product?.quantidade
    })),
    
    tipoPedido,
    dadosEntrega
  });


  useEffect(() => {
    form.setData('dadosEntrega', dadosEntrega);
  }, [dadosEntrega]);

  useEffect(() => {
    form.setData('tipoPedido', tipoPedido);
  }, [tipoPedido]);

  const updateQuantity = (key, newQuantity) => {
    router.post("/update", {
      key,
      quantity: newQuantity,
    }, {
      preserveScroll: true,
    });
  };

  const removeProduct = (key) => {
    router.post('/remove', { key }, {
      preserveScroll: true
    });
  };

  const handleSubmit = (e) => {
    console.log(products);
    e.preventDefault();
    form.post(route('pagarWL'), {
      onSuccess: () => {
     
      },
      onError: () => alert('Erro ao processar o pagamento.'),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Carrinho de Compras" />

      { cartItems?.length > 0 ? (
        <div className="bg-white border border-[#8a5a33] rounded-3xl p-6 shadow-md">
          {cartItems.map(item => (
            <div
              key={item.key}
              className="flex items-center justify-between border-b border-[#8a5a33] pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
            >
              {/* Produto ou Promoção */}
              <div className="flex items-center gap-4">
                <img
                  src={`${item.product?.imagem || item.product.product?.imagem}`}
                  alt={item.product?.name || item.product?.nome || item.product.product?.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {item.product?.name || item.product?.nome || item.product.product?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {item.product?.descricao || item.product.product?.descricao || ''}
                  </p>
                  <p className="text-md font-bold text-gray-900">
                    R${ item.product.price}
                  </p>
                  {item.isPromo && item.product?.quantidade > 1 ? (
                    <span className="text-xs text-[#613d20] font-semibold">
                      Promoção (kit com {item.product?.quantidade} itens)
                    </span>
                  ) : item.isPromo && (
                     <span className="text-xs text-[#613d20] font-semibold">
                      Promoção
                    </span>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => removeProduct(item.key)}
                  className="text-red-500 hover:text-red-600"
                  title="Remover"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="text-gray-700 hover:text-[#613d20]"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-semibold px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="text-gray-700 hover:text-[#613d20]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex justify-between items-center pt-4 border-t border-[#8a5a33] mt-4">
            <span className="text-[#613d20] font-bold text-base">SubTotal</span>
            <span className="text-lg font-bold text-gray-900">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Formulário e Finalização */}
          <form onSubmit={handleSubmit} className="mt-6">
            <FinalizarPedidoWL
              tipoPedido={tipoPedido}
              setTipoPedido={setTipoPedido}
              dadosEntrega={dadosEntrega}
              setDadosEntrega={setDadosEntrega}
            />

            {shop.loja_aberta ? (
              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="submit"
                  disabled={form.processing}
                  className="bg-[#613d20] hover:bg-[#613d20] text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4"
                >
                  Continuar Compra
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-6">
                <p className="text-red-600 font-semibold text-sm">
                  Loja fechada no momento. Não é possível continuar a compra.
                </p>
                <button
                  disabled
                  className="bg-gray-400 text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4 opacity-50 cursor-not-allowed"
                >
                  Loja Fechada
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500">Seu carrinho está vazio.</p>
      )}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Amor Com Recheio - Todos os direitos reservados
          </p>
        </div>
    </AuthenticatedLayout>
  );
}
