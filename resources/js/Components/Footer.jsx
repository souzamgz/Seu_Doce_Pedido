import {usePage } from '@inertiajs/react';


export default function Footer() {
  const { shop } = usePage().props;


  return (

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Amor Com Recheio - Todos os direitos reservados
          </p>
      </div>
  
   
  );
}

