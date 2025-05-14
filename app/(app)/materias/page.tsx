"use client";

import React, { useEffect } from "react";
import { TablaMaterias } from "@/components/tabla-materias";
import Link from "next/link";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

export default function ConfigPage() {
  const setRoute = useNavigationStore((state) => state.setRoute);

  useEffect(() => {
    setRoute([
      { label: 'School App', slug: '' },
      { label: 'Materias', slug: 'materias' },
    ]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-3xl font-bold mb-6">Sistema de Materias</h1>
      <br />
      <TablaMaterias />
      <br />
      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
        <Link href="/">Ir a inicio</Link>
      </button>
    </div>
  );
}