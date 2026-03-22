import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FinalizarPedido from '@/Pages/Cart/FinalizarPedido';
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function Cart({ cartProducts }) {
  const { auth, shop } = usePage().props;
  const informacoes = auth.informacoes;
  const user = auth.user;
  const userCupons = auth.cupons || []; // cupons vinculados ao usuário
  const enderecosSalvos = auth.enderecos || [];

  const [updatedCart, setUpdatedCart] = useState(cartProducts);
  const [tipoPedido, setTipoPedido] = useState('retirada');
  const [botao, setBotao] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(enderecosSalvos.find(end => end.is_principal) || null);
  const [enderecoTemporario, setEnderecoTemporario] = useState(null);

  // Cupom
  const [codigoCupom, setCodigoCupom] = useState('');
  const [mensagemCupom, setMensagemCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);

  const form = useForm({
    products: updatedCart.map(p => {
      let price = p.isPromo ? p.promo_price : p.product_price;
      if (cupomAplicado) {
        if (cupomAplicado.tipo_desconto === 'percentual') {
          price = price * (1 - cupomAplicado.valor_desconto / 100);
        } else {
          price = price - (cupomAplicado.valor_desconto / updatedCart.length); // divide desconto fixo entre produtos

          if(price < 0){
              price = 0;
            }
        }
      }
      return {
        id_product: p.Id_Product,
        id_promo: p.Id_Promo,
        name: p.product_name,
        promo_name: p.promo_name,
        quantity: p.quantity,
        kitquantity: p.promo_quantity,
        price,
        imagem: p.product_imagem,
        description: p.product_description,
        id_categoria: p.product_Id_Category,
      };
    }),
    informacoes,
    tipoPedido,
    cupom: cupomAplicado,
  });

  // Atualiza form quando carrinho, endereço ou cupom mudam
  useEffect(() => {
    form.setData('products', updatedCart.map(p => {
      let price = p.isPromo ? p.promo_price : p.product_price;
      if (cupomAplicado) {
        if (cupomAplicado.tipo_desconto === 'percentual') {
          price = price * (1 - cupomAplicado.valor_desconto / 100);
        } else {
          price = price - (cupomAplicado.valor_desconto / updatedCart.length);
        }
        price = Math.max(price, 0);
      }
      return {
        id_product: p.Id_Product,
        id_promo: p.Id_Promo,
        name: p.product_name,
        promo_name: p.promo_name,
        quantity: p.quantity,
        kitquantity: p.promo_quantity,
        price,
        imagem: p.product_imagem,
        description: p.product_description,
        id_categoria: p.product_Id_Category,
      };
    }));

    if(tipoPedido === 'entrega') {
      const enderecoAtual = enderecoSelecionado || enderecoTemporario;
      form.setData('endereco', {
        rua: enderecoAtual?.rua || '',
        numero: enderecoAtual?.numero || '',
        bairro: enderecoAtual?.bairro || '',
        cidade: enderecoAtual?.cidade || '',
        estado: enderecoAtual?.estado || '',
        cep: enderecoAtual?.cep || '',
        complemento: enderecoAtual?.complemento || '',
        telefone: informacoes?.telefone || '',
      });
    } else {
      form.setData('endereco', null);
    }

    form.setData('tipoPedido', tipoPedido);
    form.setData('cupom', cupomAplicado);
  }, [updatedCart, tipoPedido, enderecoSelecionado, enderecoTemporario, cupomAplicado]);

  // Função para aplicar cupom digitado
  const aplicarCupom = (e) => {
    e.preventDefault();
    if (!codigoCupom) return;

    router.post('/cupons/aplicar', { codigo: codigoCupom }, {
      onSuccess: (page) => {
        setMensagemCupom('Cupom aplicado com sucesso!');
        setCupomAplicado(page.props.cupom);
        setCodigoCupom('');
      },
      onError: (errors) => setMensagemCupom(errors.codigo || 'Erro ao aplicar o cupom'),
    });
  };

  // Função para aplicar cupom clicado da lista do usuário
  const aplicarCupomUsuario = (cupom) => {
    setCupomAplicado(cupom);
    setMensagemCupom(`Cupom ${cupom.codigo} aplicado com sucesso!`);
    setCodigoCupom('');
  };

  // Função para enviar pedido
  const handleSubmit = (e) => {
    e.preventDefault();
    form.post(route('pagar'), {
      onError: () => alert('Erro ao processar o pagamento.')
    });
  };

  // Manipulação de quantidade e remoção
  const decreaseQuantity = (productId) => {
    const product = updatedCart.find(p => p.Id_Product === productId);
    const newQuantity = product && product.quantity > 1 ? product.quantity - 1 : 0;
    if(newQuantity === 0) removeProduct(productId);
    else updateQuantity(productId, newQuantity);
  };

  const increaseQuantity = (productId) => {
    const product = updatedCart.find(p => p.Id_Product === productId);
    updateQuantity(productId, product.quantity + 1);
  };

  const removeProduct = (productId) => {
    router.post('/deleteC', { product_id: productId }, {
      preserveScroll: true,
      onSuccess: () => setUpdatedCart(prev => prev.filter(p => p.Id_Product !== productId)),
      onError: () => alert('Erro ao remover o produto.')
    });
  };

  const updateQuantity = (productId, quantity) => {
    router.post("/updateC", { product_id: productId, quantity }, {
      preserveScroll: true,
      onSuccess: () => setUpdatedCart(prev => prev.map(p => p.Id_Product === productId ? { ...p, quantity } : p)),
      onError: () => alert('Erro ao atualizar o carrinho.')
    });
  };

  // Cálculo de subtotal, desconto e total
  const subtotal = updatedCart.reduce((sum, product) => {
    const price = product.isPromo ? product.promo_price : product.product_price;
    return sum + price * product.quantity;
  }, 0);

  let desconto = 0;
  if (cupomAplicado) {
    if (cupomAplicado.tipo_desconto === 'percentual') {
      desconto = subtotal * (cupomAplicado.valor_desconto / 100);
    } else {
      desconto = parseFloat(cupomAplicado.valor_desconto);
    }
  }

const totalComDesconto = Math.max(subtotal - desconto, 0);


  return (
    <AuthenticatedLayout>
      <Head title="Carrinho de Compras" />

      {updatedCart.length > 0 ? (
        <div className="bg-white border border-[#8a5a33] rounded-3xl p-6 shadow-md">

          {/* Lista de produtos */}
          {updatedCart.map(product => (
            <div key={product.Id_Product} className="flex items-center justify-between border-b border-[#8a5a33] pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
              <div className="flex items-center gap-4">
                <img src={product.isPromo ? product.promo_image : product.product_image} alt={product.product_name} className="w-20 h-20 rounded-xl object-cover"/>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">{product.product_name}</h3>
                  <p className="text-xs text-gray-500">{product.product_description}</p>
                  <p className="text-md font-bold text-gray-900">
                    {product.isPromo ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">R$ {Number(product.product_price).toFixed(2).replace('.', ',')}</span>
                        <span className="text-[#613d20]">R$ {Number(product.promo_price).toFixed(2).replace('.', ',')}</span>
                      </>
                    ) : `R$ ${Number(product.product_price).toFixed(2).replace('.', ',')}`}
                  </p>
                  {product.promo_quantity > 1 && product.isPromo && (
                    <span className="text-sm font-semibold px-2">{product.quantity} kit(s) de {product.promo_quantity}x</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => removeProduct(product.Id_Product)} className="text-red-500 hover:text-red-600" title="Remover">
                  <Trash2 size={18}/>
                </button>
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50">
                  <button onClick={() => decreaseQuantity(product.Id_Product)} className="text-gray-700 hover:text-[#613d20]"><Minus size={16}/></button>
                  <span className="text-sm font-semibold px-2">{product.quantity}</span>
                  <button onClick={() => increaseQuantity(product.Id_Product)} className="text-gray-700 hover:text-[#613d20]"><Plus size={16}/></button>
                </div>
              </div>
            </div>
          ))}

          {/* Formulário cupom */}
          <form onSubmit={aplicarCupom} className="flex gap-2 mt-4">
            <input
              type="text"
              value={codigoCupom}
              onChange={e => setCodigoCupom(e.target.value)}
              placeholder="Digite o código do cupom"
              className="border rounded p-2 flex-1"
            />
            <button type="submit" className="bg-[#8a5a33] text-white px-4 py-2 rounded hover:bg-[#613d20]">Aplicar</button>
          </form>
          {mensagemCupom && <p className="text-green-600 text-sm mt-1">{mensagemCupom}</p>}

          {/* Lista de cupons do usuário */}
       {userCupons.length > 0 && (
  <div className="mt-2 flex flex-wrap gap-2">
    {userCupons
      .filter(cup => 
        cup.ativo &&
        (
          !cup.limite_usos || 
          (cup.pivot?.usos ?? 0) < cup.limite_usos
        )
      )
      .map(cup => (
        <button
          key={cup.id}
          onClick={() => aplicarCupomUsuario(cup)}
          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 text-sm"
        >
          {cup.codigo} - {cup.tipo_desconto === 'percentual'
            ? `${cup.valor_desconto}%`
            : `R$ ${Number(cup.valor_desconto).toFixed(2).replace('.', ',')}`}
        </button>
      ))}
  </div>
)}


          {/* Subtotal, desconto e total */}
          <div className="flex justify-between items-center pt-4 border-t border-[#8a5a33] mt-4">
            <span className="text-[#613d20] font-bold text-base">Subtotal</span>
            <span className="text-lg font-bold text-gray-900">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>

          {cupomAplicado && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-[#613d20] font-semibold text-sm">Desconto ({cupomAplicado.codigo})</span>
              <span className="text-sm font-semibold text-green-600">- R$ {desconto.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#8a5a33]">
            <span className="text-[#613d20] font-bold text-base">Total</span>
            <span className="text-lg font-bold text-gray-900">R$ {totalComDesconto.toFixed(2).replace('.', ',')}</span>
          </div>

          {/* Finalizar Pedido */}
          <FinalizarPedido 
            tipoPedido={tipoPedido} 
            setTipoPedido={setTipoPedido} 
            informacoes={informacoes}  
            setBotao={setBotao}
            enderecoSelecionado={enderecoSelecionado}
            setEnderecoSelecionado={setEnderecoSelecionado}
            enderecoTemporario={enderecoTemporario}
            setEnderecoTemporario={setEnderecoTemporario}
          />

          {/* Botão Continuar Compra */}
          <div className="flex flex-col gap-3 mt-6">
            {shop.loja_aberta || user.admin ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={botao}
                className={`bg-[#613d20] text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4 transition 
                  ${botao ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8a5a33]'}`
                }
              >
                Continuar Compra
              </button>
            ) : (
              <button disabled className="bg-gray-400 text-white py-2 px-5 rounded-full text-sm font-medium shadow-md mt-4 opacity-50 cursor-not-allowed">
                Loja Fechada
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500 font-Montserrat">Seu carrinho está vazio.</p>
      )}

      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Amor Com Recheio - Todos os direitos reservados
        </p>
      </div>
    </AuthenticatedLayout>
  );
}
