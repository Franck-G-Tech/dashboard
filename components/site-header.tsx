"use client"; // Indica que este componente se renderiza en el cliente

import React from "react"; // Importa la biblioteca React para crear componentes
import { SidebarIcon } from "lucide-react"; // Importa el icono de la barra lateral desde la biblioteca "lucide-react"
import { ThemeToggle } from "./theme/theme-toggle"; // Importa el componente "ThemeToggle" desde un archivo local
//import { SearchForm } from "@/components/search-form"; // Comentado: Importación del componente de búsqueda (no se usa)
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; 
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import useBreadcrumb from "@/hooks/use-breadcrumb";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const breadcrumbPath = useBreadcrumb();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          {/*
            * - "className='hidden sm:block'":  Oculta el breadcrumb en pantallas pequeñas y lo muestra en pantallas medianas y grandes.
            */}
          <BreadcrumbList>
            
            
            {Array.isArray(breadcrumbPath) &&
              breadcrumbPath.map((item, index) => (
                /*
                 * Itera sobre los elementos de la ruta del breadcrumb (breadcrumbPath), que debe ser un array.
                 * - "Array.isArray(breadcrumbPath)": Verifica si breadcrumbPath es un array antes de iterar.
                 * - "item": Representa cada segmento del breadcrumb.
                 * - "index": Representa el índice del segmento actual.
                 */
                <React.Fragment key={index}>
                  {/*
                    * - "React.Fragment":  Agrupa elementos sin agregar un nodo extra al DOM.
                    * - "key={index}":  Proporciona una clave única para cada elemento en la iteración.
                    */}
                  {index < breadcrumbPath.length - 1 ? (
                    /* Si no es el último elemento del breadcrumb */
                    <BreadcrumbItem>
                      {/* Representa un elemento individual del breadcrumb */}
                      <BreadcrumbLink
                        href={`/${breadcrumbPath
                          .slice(1, index + 1) // Extrae los segmentos de la ruta hasta el elemento actual.
                          .map((i) => i.slug) // Mapea los segmentos para obtener los "slugs" (partes de la URL).
                          .join("/")}`} // Une los "slugs" con "/" para formar la URL.
                      >
                        {item.label}
                        {/* Muestra la etiqueta del segmento del breadcrumb */}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  ) : (
                    /* Si es el último elemento del breadcrumb */
                    <BreadcrumbItem>
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      {/* Muestra la etiqueta del segmento actual como la página actual */}
                    </BreadcrumbItem>
                  )}

                  {index < breadcrumbPath.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                  {/*
                    * Si no es el último elemento, muestra un separador.
                    * - "BreadcrumbSeparator":  Muestra un separador visual entre los elementos del breadcrumb.
                    */}
                </React.Fragment>
              ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
        {/* Comentado: Renderiza el componente de búsqueda (no se usa en este código) */}
        <div className="justify-end flex-1 sm:flex ">
          <ThemeToggle />
        </div>
       
      </div>
    </header>
  );
}
