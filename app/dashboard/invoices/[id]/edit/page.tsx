import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';


// La URL también debe actualizarse con un id como sigue: http://localhost:3000/dashboard/invoice/uuid/edit

// UUID frente a claves de incremento automático

// Usamos UUID en lugar de incrementar claves (por ejemplo, 1, 2, 3, etc.). Esto hace que la URL sea más larga; sin embargo, los UUID eliminan el riesgo de colisión de ID, son únicos a nivel mundial y reducen el riesgo de ataques de enumeración, lo que los hace ideales para bases de datos grandes.

// Sin embargo, si prefiere URL más limpias, es posible que prefiera utilizar claves de incremento automático.


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
