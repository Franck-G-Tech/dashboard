"use client";
import React, { useEffect } from 'react';
import { TablaEstudiantes } from "@/components/tabla-estudiantes";
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
    <div className="flex  flex-col items-center justify-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Estudiantes</h1>
      <TablaEstudiantes />
      <br />
    </div>
  );
}