
import AdminLayout from '@/Layouts/AdminLayout';
import ProductCreate from './Create';
import ProductIndex from './Index';
import { Head } from '@inertiajs/react';

export default function Product({categories, products}) {
return(
<AdminLayout

>
    <Head title="Produtos" />

    <ProductCreate categories={categories} />

    
    <ProductIndex products={products} categories={categories} />


</AdminLayout>
)

    
}
