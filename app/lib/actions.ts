'use server';
import { z } from "zod";
import { revalidatePath } from 'next/cache'; // Importar revalidatePath si es necesario para la revalidación de caché
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // El campo está configurado específicamente para coaccionar (cambiar) de una cadena a un número y al mismo tiempo validar su tipo.
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
const CreateInvoice = FormSchema.omit({ id: true, date: true });

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Consejo: Si está trabajando con formularios que tienen muchos campos, es posible que desee considerar usar el entries()método con JavaScript Object.fromEntries().
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100; // Convertir a centavos como buena práctica para evitar problemas de precisión con los números de punto flotante.
  const date = new Date().toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices'); // Revalidar la caché para la ruta de la lista de facturas
  redirect('/dashboard/invoices'); // Redirigir a la lista de facturas después de crear una nueva factura
}


const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
