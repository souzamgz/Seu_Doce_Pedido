import React from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function CategoryIndex({ categories }) {
    const { delete: deleteCategory } = useForm();

    const handleDelete = (id) => {
        if (confirm('Você tem certeza que deseja excluir esta categoria?')) {
            deleteCategory(route('categories.destroy', id));
        }
    };


  
}
