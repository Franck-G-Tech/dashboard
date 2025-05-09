import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  slug: string;
}

function useBreadcrumb() {
  const pathname = usePathname();
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([{ label: 'School App', slug: '' }]);

  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/').filter(segment => segment !== '');
      const formattedBreadcrumb = pathSegments.map(segment => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1), // Nombre para mostrar (primera letra mayúscula)
        slug: segment.toLowerCase(), // Slug para la URL (minúscula)
      }));
      setBreadcrumb([{ label: 'School App', slug: '' }, ...formattedBreadcrumb]);
    }
  }, [pathname]);

  return breadcrumb;
}

export default useBreadcrumb;