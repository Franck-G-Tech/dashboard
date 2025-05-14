"use client";
import React, { useEffect } from 'react';
import { TablaEstudiantes } from "@/components/tabla-estudiantes";
import Link from "next/link";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación

export default function ConfigPage() {
  const setRoute = useNavigationStore((state) => state.setRoute);

  useEffect(() => {
    // Define la ruta para la página de estudiantes
    setRoute([
      { label: 'School App', slug: '' },
      { label: 'Estudiantes', slug: 'estudiantes' },
    ]);
  }, [setRoute]); // Dependencia para que se ejecute solo al montar el componente

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Sistema de Estudiantes</h1>
      <TablaEstudiantes />
      <br />
      <button className="mt-4 px-4 py-2 border rounded">
        <Link href="/">Ir a inicio</Link>
      </button>
    </div>
  );
}