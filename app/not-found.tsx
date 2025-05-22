"use client";

import React, { useEffect } from 'react';
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb
import useNavigationStore from '@/store/navigationStore';

export default function NotFound() {const setRoute = useNavigationStore((state) => state.setRoute);

  useEffect(() => {
    setRoute([
      { label: 'School App', slug: '' },
      { label: '#404', slug: '' },
    ]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          #404
        </h1>
        <p className=" text-base sm:text-lg md:text-xl">
          Pagina no encontrada
        </p>
      </div>    </div>
  );
};

