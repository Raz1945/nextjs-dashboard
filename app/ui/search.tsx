'use client'; // Indica que este componente se renderiza en el cliente (navegador) y no en el servidor.

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

//Note    ¿Por qué utilizar parámetros de búsqueda de URL?
// Utilizará parámetros de búsqueda de URL para administrar el estado de la búsqueda.
// Este patrón puede ser nuevo si estás acostumbrado a hacerlo con el estado del lado del cliente.
// Hay un par de beneficios de implementar la búsqueda con parámetros de URL:
// - URL que se pueden marcar como favoritas y compartir: Dado que los parámetros de búsqueda están en la URL,
//   los usuarios pueden marcar como favorito el estado actual de la aplicación,
//   incluidas sus consultas y filtros de búsqueda, para futuras referencias o para compartir.
// - Representación del lado del servidor: Los parámetros de URL se pueden consumir directamente en el servidor para representar el estado inicial,
//   lo que facilita el manejo de la representación del servidor.
// - Análisis y seguimiento: Tener consultas de búsqueda y filtros directamente en la URL
//   facilita el seguimiento del comportamiento del usuario sin requerir lógica adicional del lado del cliente.

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); // Los parámetros de búsqueda son la parte de una URL que viene después del signo de interrogación (?),
  //  y se usan para pasar información entre el cliente y el servidor sin tener que usar rutas distintas.
  // Ejemplo: En la URL "https://example.com/page?query=nextjs&page=2",
  // los parámetros de búsqueda son "query=nextjs&page=2".
  const pathname = usePathname(); // El ${pathname} es el camino actual, Ejemplo: "/dashboard/invoices".
  const { replace } = useRouter();

  // Función para manejar/captura los datos de la búsqueda y actualizar los parámetros de la URL
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams); // URLSearchParams es una API web que proporciona métodos de utilidad
    // para manipular los parámetros de consulta de URL.
    // En lugar de crear una cadena literal compleja,
    // puedes usarla para obtener la cadena de parámetros como ?page=1&query=a.
    
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className='relative flex flex-1 flex-shrink-0'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
    </div>
  );
}
