"use client";

import React, { useEffect } from 'react';
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb
//import { Button } from '@/components/ui/button'; // Asegúrate de tener estos componentes de Shadcn UI
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  const setRoute = useNavigationStore((state) => state.setRoute);

  useEffect(() => {
    setRoute([
      { label: 'School App', slug: '' },
    ]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Bienvenido a School App
        </h1>
        <p className=" text-base sm:text-lg md:text-xl">
          Tu solución centralizada para la gestión y visualización de datos.
        </p>
      </div>
      {/*
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white">
              Comienza a explorar
            </CardTitle>
            <CardDescription className="text-gray-400">
              Accede a las diferentes secciones de la aplicación para gestionar tus datos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                asChild // Convierte el botón en un enlace de Next.js
                variant="outline"
                className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 border-blue-500/30 transition-all duration-200"
              >
                <a href="/maestros">Gestionar Maestros</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200 border-purple-500/30 transition-all duration-200"
              >
                <a href="/horarios">Gestionar Horarios</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-green-500/20 text-green-300 hover:bg-green-500/30 hover:text-green-200 border-green-500/30 transition-all duration-200"
              >
                <a href="/materias">Gestionar Materias</a>
              </Button>
               <Button
                asChild
                variant="outline"
                className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 hover:text-yellow-200 border-yellow-500/30 transition-all duration-200"
              >
                <a href="/aulas">Gestionar Aulas</a>
              </Button>
            </div>
             <p className="text-gray-400 text-sm">
              Esta aplicación te permite administrar la información de tu escuela de manera eficiente.
            </p>
          </CardContent>
        </Card>
       */}
    </div>
  );
};

export default HomePage;