"use client";

import React, { useEffect } from "react";
import { TablaHorarios } from "@/components/tabla-horarios";
import Link from "next/link";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

export default function ConfigPage() {
  const setRoute = useNavigationStore((state) => state.setRoute);

  useEffect(() => {
    setRoute([
      { label: 'School App', slug: '' },
      { label: 'Horarios', slug: 'horarios' },
    ]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Horarios</h1>
      <br />
      <TablaHorarios />
      <br />
      
    </div>
  );
}