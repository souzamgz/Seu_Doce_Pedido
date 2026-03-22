import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import PromocaoIndex from './Index';
import PromocaoCreate from './Create';

export default function Promocoes({ promocoes, products }) {
  return (
    <AdminLayout>
      <Head title="Promoções" />
      <div className="text-center container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <PromocaoCreate products={products} />
        <PromocaoIndex promocoes={promocoes} />
      </div>
    </AdminLayout>
  );
}
