import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Mail, Phone, MapPin,  Instagram } from 'lucide-react';

export default function Sobre() {
  const { shop } = usePage().props;

  const formatarTelefone = (numero) => {
    // Se o número não existir ou for nulo, retorna uma string vazia
    if (!numero) return '';

    // Converte para string e remove qualquer caractere que não seja dígito
    const numeroStr = String(numero).replace(/\D/g, '');

    const tamanho = numeroStr.length;

    if (tamanho === 11) {
      // Formato para celular: (XX) 9XXXX-XXXX
      return `(${numeroStr.substring(0, 2)}) ${numeroStr.substring(2, 7)}-${numeroStr.substring(7)}`;
    }

    if (tamanho === 10) {
      // Formato para telefone fixo: (XX) XXXX-XXXX
      return `(${numeroStr.substring(0, 2)}) ${numeroStr.substring(2, 6)}-${numeroStr.substring(6)}`;
    }

    // Se o número tiver um tamanho diferente, retorna como está
    return numeroStr;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Sobre" />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Banner / Imagem de capa */}
        <div className="w-full h-64 rounded-2xl overflow-hidden mb-12 shadow-lg">
          <img
            src="/imagens/Banner2 - Editado.png"
            alt="Nossa loja"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Título */}
        <h1 className="text-5xl font-bold text-center mb-6 text-[#613d20]">
          Nossa História
        </h1>

        {/* Texto principal */}
        <p className="text-lg text-gray-700 leading-relaxed text-justify mb-10 max-w-3xl mx-auto">
          A Amor com Recheio nasceu em agosto de 2025, de um sonho cheio de amor.
          Eu sou a Manu e sempre acreditei que doces são mais do que sobremesas, são gestos de carinho. Foi assim, entre receitas caseiras e dedicação, que decidi transformar minha paixão pela confeitaria em um negócio que adoça momentos especiais.

          Cada pedido é preparado com capricho e com a mesma alegria do primeiro doce. A Amor com Recheio é o meu sonho ganhando forma, e é uma alegria compartilhar esse pedacinho de amor com você.
        </p>

        {/* Galeria de imagens 
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <img
            src="/images/loja1.jpg"
            alt="Foto 1"
            className="rounded-xl object-cover h-60 w-full shadow-md hover:scale-105 transition-transform duration-300"
          />
          <img
            src="/images/loja2.jpg"
            alt="Foto 2"
            className="rounded-xl object-cover h-60 w-full shadow-md hover:scale-105 transition-transform duration-300"
          />
          <img
            src="/images/loja3.jpg"
            alt="Foto 3"
            className="rounded-xl object-cover h-60 w-full shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
        */}
        {/* Seção de contato */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#fdfdfd] shadow-lg rounded-2xl p-6 text-center border-t-4 border-[#613d20] hover:shadow-xl transition-shadow duration-300">
            <Mail className="mx-auto w-10 h-10 text-[#8a5a33] mb-3" />
            <h2 className="font-semibold text-xl text-[#613d20]">E-mail</h2>
            <p className="text-gray-600">{shop.email}</p>
          </div>

          <div className="bg-[#fdfdfd] shadow-lg rounded-2xl p-6 text-center border-t-4 border-[#8a5a33] hover:shadow-xl transition-shadow duration-300">
            <Phone className="mx-auto w-10 h-10 text-[#bc845b] mb-3" />
            <h2 className="font-semibold text-xl text-[#613d20]">Telefone</h2>
            <p className="text-gray-600">{formatarTelefone(shop.telefone)}</p>
          </div>

          <div className="bg-[#fdfdfd] shadow-lg rounded-2xl p-6 text-center border-t-4 border-[#bc845b] hover:shadow-xl transition-shadow duration-300">
            <MapPin className="mx-auto w-10 h-10 text-[#8a5a33] mb-3" />
            <h2 className="font-semibold text-xl text-[#613d20]">Endereço</h2>
            <p className="text-gray-600">{shop.rua}, {shop.numero}  - {shop.cidade}, {shop.estado}</p>
          </div>
        </div>

        {/* Botão de call-to-action */}
        <div className="text-center mt-12 flex justify-center items-center gap-4">
          <a
            // Substitua pelo seu número completo
            href={`https://wa.me/55${shop.telefone}`}
            // Abre o link em uma nova aba, o que é bom para links externos
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-[#128C7E] transition-colors"
          >
            <Phone size={20} /> {/* Ícone opcional */}
            Fale Conosco no WhatsApp
          </a>

            <a
  
    href={`https://www.instagram.com/${shop.instagram}`}
    target="_blank"
    rel="noopener noreferrer"
    // Classes de gradiente do Tailwind para simular as cores do Instagram
    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:opacity-90 transition-opacity"
  >
    <Instagram size={20} />
    Siga-nos
  </a>

        </div>

        {/* Rodapé */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Amor Com Recheio - Todos os direitos reservados
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

