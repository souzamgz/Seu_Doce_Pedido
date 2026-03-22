import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/Footer';
import { Link, Head, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, ReceiptText, MessagesSquare, LogOut } from 'lucide-react';
import { FiShoppingCart,FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Welcome({ products, categories, promocoes }) {
  const shop = usePage().props.shop;  
  const banner = shop.banner;


  const [showFloating, setShowFloating] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  const cartTotal = usePage().props.auth?.cart?.totalItems || 0;

  // Estados para busca e filtro
  const [searchText, setSearchText] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Estado para controle do botão voltar ao topo
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Estado para armazenar o texto de cada botão "Adicionar ao carrinho"
  const [buttonTexts, setButtonTexts] = useState({});


  // Monitorar scroll para mostrar/ocultar botão voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 100);
      setShowFloating(window.pageYOffset > 100);
    };

    window.addEventListener('scroll', handleScroll);

    // Limpar listener quando componente desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Função para rolar a página suavemente até o topo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para adicionar produto ao carrinho (session / cache)
  const addToCart = (Id_Product, isPromo, price, promoId, quantidade, kitquantidade) => {
    router.post("/cartwl/add", { 
    product_id: Id_Product, 
    is_promo: isPromo,
    price: price,
    promo_id: promoId,
    quantity: quantidade ,
    kitquantidade : kitquantidade,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setButtonTexts((prev) => ({ ...prev, [Id_Product]: "Adicionado!" }));
      },
      onError: (errors) => {
        console.error(errors);
        alert("Erro ao adicionar o produto ao carrinho.");
        setButtonTexts((prev) => ({ ...prev, [Id_Product]: "Adicionar ao Carrinho" }));
      },
    });

    // Volta ao texto original após 800ms
    setTimeout(() => {
      setButtonTexts((prev) => ({ ...prev, [Id_Product]: "Adicionar ao Carrinho" }));
    }, 800);
  };

  // Filtrar produtos conforme texto e filtro
  const filteredProducts = products.filter(product => {
    const priceStr = product.price.toString();
    const match = (field) => field.toLowerCase().includes(searchText.toLowerCase());

    if (!searchText) return true;

    switch (filterField) {
      case 'category':
        const cat = categories.find(c => c.id === product.id_categoria);
        return cat && match(cat.name);
      case 'name':
        return match(product.name);
      case 'description':
        return match(product.descricao);
      case 'price':
        return priceStr.includes(searchText);
      case 'all':
      default:
        const catName = categories.find(c => c.id === product.id_categoria)?.name || '';
        return (
          match(product.name) ||
          match(product.descricao) ||
          match(catName) ||
          priceStr.includes(searchText)
        );
    }
  });

   const carouselsRef = useRef({});
 
  const handleLeftClick = (categoryId) => {
   const el = carouselsRef.current[categoryId]?.current;
   if (el) el.scrollLeft -= 200;
 };
 
 const handleRightClick = (categoryId) => {
   const el = carouselsRef.current[categoryId]?.current;
   if (el) el.scrollLeft += 200;
 };
   

    const categoriaRef = useRef(null);
  
    const scrollLeft = () => {
      categoriaRef.current.scrollLeft -= 200;
    };
  
    const scrollRight = () => {
      categoriaRef.current.scrollLeft += 200;
    };
  

  return (
    <AuthenticatedLayout>
      <Head title="Bem-vindo" />
      <div className="flex justify-center mt-6 mb-10">
  <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-full font-semibold text-white
    ${shop.loja_aberta ? 'bg-green-600' : 'bg-red-600'}
    shadow-lg transition-colors duration-300`}
    title={`A loja está atualmente ${shop.loja_aberta ? 'ABERTA' : 'FECHADA'}`}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-6 w-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      {shop.loja_aberta ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /> // checkmark verde
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> // X vermelho
      )}
    </svg>
    <span className="uppercase tracking-wide">
      Loja {shop.loja_aberta ? 'Aberta' : 'Fechada'}
    </span>
  </div>
</div>


      <div className="relative w-full mt-10">
        {banner ? (
          <img
            src={banner.imagem}
            alt={banner.nome}
              className="w-full max-h-96 object-contain rounded shadow-md mx-auto"
          />
        ) : (
          <div></div>
        )}
      </div>

{promocoes.length > 0 && (
  <div className="w-full px-4 md:px-10 mt-10">
    <h2 className="text-center text-3xl font-bold text-[#613d20] mb-8">
      PROMOÇÕES
    </h2>

    <div className="grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-auto max-w-7xl px-4">
      {promocoes.map((promo) => {
        const product = promo.product;
        const precoOriginal = product?.price || null;
        const precoPromo = parseFloat(promo.price);
        const unidade = (precoPromo / promo.quantidade);
        const porcentagem = precoOriginal
          ? Math.round(((precoOriginal - precoPromo / promo.quantidade) / precoOriginal) * 100)
          : null;

        return (
          <div
            key={promo.id}
            className="flex flex-col justify-between bg-white rounded-2xl shadow-md p-4 transition-transform hover:scale-[1.02] h-[480px]"
          >
            <div>
              <div className="relative w-full h-40 mb-4">
                <img
                  src={product?.imagem || promo.imagem}
                  alt="Promoção"
                  className="w-full h-full object-contain rounded-md"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">
                  OFERTA
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-1 text-center truncate">
                {product?.name || promo.nome}
                
              </h3>

              <p className="text-sm text-gray-500 mb-2 text-center line-clamp-2 h-[2.8rem]">
                {product?.descricao || promo.descricao}
              </p>

              <div className="text-center text-sm text-gray-700 mb-2">
                {promo.quantidade} un. por:
              </div>

              <div className="flex justify-center items-baseline gap-2 mb-1">
                {precoOriginal && (
                  <span className="text-sm text-gray-400 line-through">
                    R${precoOriginal.replace('.', ',')}
                  </span>
                )}
                <span className="text-xl font-bold text-[#613d20]">
                  R${precoPromo.toFixed(2).replace('.', ',')}
                </span>
                
                 
              </div>
               <div className="flex flex-col items-center mb-2">
  <p className="text-sm text-gray-600">Preço unitário</p>
  <span className="text-xl font-extrabold text-[#613d20] tracking-tight">
    R$ {unidade.toFixed(2).replace('.', ',')}
  </span>
</div>

              

              {porcentagem && (
                <div className="text-center text-xs text-green-600 font-semibold mb-2">
                  ECONOMIZE {porcentagem}%
                </div>
              )}

              {promo.estoque && (
              <div className="text-sm text-gray-600 text-center mb-2">
                Estoque: <span className="font-bold">{promo.estoque}</span>
              </div>
              )}
             
            </div>

            <div className="mt-auto pt-3">
              <button
                className={`w-full py-2 rounded-full font-semibold text-white transition-colors duration-300 ${
                  buttonTexts[promo.Id_Product] === 'Adicionado!'
                    ? 'bg-green-500 hover:bg-green-600 cursor-default'
                    : 'bg-[#613d20] hover:bg-[#613d20]'
                }`}
               onClick={() =>
            addToCart(
            promo.Id_Product,
            true,
            promo.price,
            promo.id,
            1,
            promo.quantidade,
            )
}
                disabled={buttonTexts[promo.Id_Product] === 'Adicionado!'}
              >
                {buttonTexts[promo.Id_Product] || 'Adicionar ao carrinho'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}




<div className="relative w-full">
      <h2 className="text-center text-xl font-bold text-[#613d20] mb-6 mt-10">ESCOLHA POR CATEGORIA</h2>

      <div className="flex items-center justify-between px-4">
        {/* Botão esquerdo */}
        <button
          onClick={scrollLeft}
          className="p-2 bg-white rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <FiChevronLeft className="text-[#613d20]" size={24} />
        </button>

        {/* Carrossel */}
        <div
          ref={categoriaRef}
          className="flex items-center gap-4 overflow-x-auto px-2 py-2 hide-scrollbar scroll-smooth"
        >
        
          {categories.map((category) => {
              const filteredCategoryProducts = filteredProducts.filter(
         p => p.id_categoria === category.id
       );
     
       if (filteredCategoryProducts.length === 0) return null;

        return (
         <div
              key={category.id}
              className="flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
              onClick={() => {
                const el = document.getElementById(`categoria-${category.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="w-24 h-24 rounded-full border-2 border-[#613d20] overflow-hidden flex items-center justify-center bg-white shadow">
                {category.imagem ? (
                  <img
                    src={`/imagens/categorias/${category.imagem}`}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Sem imagem</span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-700">{category.name.toUpperCase()}</p>
            </div>
       );
           
})}
        </div>

        {/* Botão direito */}
        <button
          onClick={scrollRight}
          className="p-2 bg-white rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <FiChevronRight className="text-[#613d20]" size={24} />
        </button>
      </div>
    </div>

      {/* Barra de pesquisa e filtro */}
      <div className="flex items-center gap-2 my-6 max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#613d20]"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className="bg-[#613d20] text-white p-2 rounded-md hover:bg-[#613d20]"
          title="Filtrar por"
        >
          <FiFilter size={20} />
        </button>

        {showFilterOptions && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-md z-50 w-40">
            <ul>
              {[
                { label: 'Todos', value: 'all' },
                { label: 'Categoria', value: 'category' },
                { label: 'Nome', value: 'name' },
                { label: 'Descrição', value: 'description' },
                { label: 'Preço', value: 'price' },
              ].map(option => (
                <li
                  key={option.value}
                  onClick={() => {
                    setFilterField(option.value);
                    setShowFilterOptions(false);
                  }}
                  className={`cursor-pointer px-4 py-2 hover:bg-[#8a5a33] ${
                    filterField === option.value ? 'font-bold bg-[#8a5a33]' : ''
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Produtos filtrados agrupados por categoria */}
      {categories.map((category, index) => {
  const filteredCategoryProducts = filteredProducts.filter(
    p => p.id_categoria === category.id
  );

  if (filteredCategoryProducts.length === 0) return null;

  if (!carouselsRef.current[category.id]) {
    carouselsRef.current[category.id] = React.createRef();
  }

  return (
    <div key={category.id} className="mb-20 relative" id={`categoria-${category.id}`}>
      <h2 className="text-2xl font-semibold text-[#613d20] mb-6 pb-2 px-4 ml-6 text-center">
        {category.name.toUpperCase()}
      </h2>

      {/* Botão Esquerdo */}
      <button
        onClick={() => handleLeftClick(category.id)}
        className="lg:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Carrossel com estilo padronizado */}
      <div className="px-8">
        <div
          ref={carouselsRef.current[category.id]}
          className="flex gap-6 snap-x snap-mandatory pb-4 scroll-smooth overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
        >
          {filteredCategoryProducts.map(product => (
            <div
              key={product.id}
              className="w-[300px] flex-shrink-0 bg-white rounded-xl p-4 flex flex-col justify-between items-center text-center shadow-md snap-start transition-transform hover:scale-[1.03] h-[400px]"
            >
              <div className="flex-1 flex flex-col justify-between items-center">
                <div className="flex-1 flex flex-col justify-center items-center">
                  <img
                    src={product.imagem}
                    alt={`Imagem de ${product.name}`}
                    className="w-44 h-44 object-contain rounded-md mb-2"
                  />
                  <h3 className="text-lg font-bold text-gray-900 truncate w-full">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.descricao}</p>
                </div>
                <p className="text-xl font-extrabold text-gray-900 mt-3">
                  R${Number(product.price).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <button
                className={`w-full py-2 rounded-full font-semibold shadow-md transition-colors duration-300 ${
                  buttonTexts[product.id] === 'Adicionado!'
                    ? 'bg-[#613d20] hover:bg-green-600 cursor-default'
                    : 'bg-[#613d20] hover:bg-[#8a5a33]'
                } text-white`}
                onClick={() => addToCart(product.id)}
                disabled={buttonTexts[product.id] === 'Adicionado!'}
              >
                {buttonTexts[product.id] || 'Adicionar ao carrinho'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Botão Direito */}
      <button
        onClick={() => handleRightClick(category.id)}
        className="lg:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
})}

   
  {showFloating && (
  <div className="fixed bottom-20 right-6 z-50">
    <Link
      href="/CarrinhoWL"
      className="relative flex items-center justify-center w-12 h-12 bg-white text-[#8a5a33] border border-[#613d20] rounded-full shadow-lg hover:bg-gray-100 transition"
      title="Carrinho"
    >
      <ShoppingCart className="h-6 w-6" />
      {cartTotal > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-[#8a5a33] border border-[#613d20] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {cartTotal}
        </span>
      )}
    </Link>
  </div>
)}


      {showScrollTop && (
        
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-3 bg-[#613d20] text-white rounded-full shadow-lg hover:bg-[#613d20] transition" title="Voltar ao topo" style={{ zIndex: 1000 }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      
      <Footer>
        
      </Footer>
    </AuthenticatedLayout>
  );
}