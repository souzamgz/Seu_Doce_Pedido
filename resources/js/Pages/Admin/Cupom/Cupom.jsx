import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CupomCreate from './Create';
import CupomIndex from './Index';
import CupomEdit from './Show';

export default function Cupom({ cupons }) {
  const [editingCupom, setEditingCupom] = useState(null);

  return (
    <AdminLayout>
      <Head title="Cupons" />

      {/* Formulário de criar cupom */}
      <CupomCreate />

      {/* Lista de cupons */}
      <CupomIndex cupons={cupons} onEdit={setEditingCupom} />

      {/* Modal de edição */}
      {editingCupom && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <CupomEdit 
            cupom={editingCupom} 
            onClose={() => setEditingCupom(null)} 
          />
        </div>
      )}
    </AdminLayout>
  );
}
