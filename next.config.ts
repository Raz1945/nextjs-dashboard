import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Mejora el rendimiento de las páginas que usan fetch con cache: 'force-cache' o 'no-store'
  // al permitir que Next.js sirva contenido previamente renderizado mientras se genera nuevo contenido en segundo plano.
  // Esto es especialmente útil para dashboards y otras páginas de datos que necesitan actualizaciones frecuentes.
  // experimental: {
  //   ppr: 'incremental'
  // }
};

export default nextConfig;