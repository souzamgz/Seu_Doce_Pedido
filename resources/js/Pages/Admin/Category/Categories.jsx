
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import CategoryIndex from './Index';
import CategoryCreate from './Create';

export default function Categories({ categories }) {
    
    return (
        <AdminLayout>
            <Head title="Categorias" />
            <div className="text-center container mx-auto p-6 bg-white shadow-lg rounded-lg">

                <CategoryCreate />
                
                <CategoryIndex categories={categories} />
            </div>



        </AdminLayout>
    );
}

