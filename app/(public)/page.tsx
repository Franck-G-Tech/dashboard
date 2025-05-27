"use client";

import React, { useEffect } from "react";
import useNavigationStore from "@/store/navigationStore"; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb
import { Button } from "@/components/ui/button"; // Asegúrate de tener estos componentes de Shadcn UI
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { NavUser } from "@/components/nav-user";

import AnimatedBox from "@/components/efec/AnimatedBox";
import SplitText from "./SplitText";

const HomePage = () => {
  const setRoute = useNavigationStore((state) => state.setRoute);

  useEffect(() => {
    setRoute([{ label: "School App", slug: "" }]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <div className="text-center -space-y-6">
        <AnimatedBox text="Bienvenido" />
        <AnimatedBox text="  " />
        <AnimatedBox text="School App" />
      </div><br />
      
      <br />
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold ">
            <SplitText text="Comienza a explorar" />
          </CardTitle>
          <CardDescription className="text-gray-400">
            Accede a las diferentes secciones de la aplicación para gestionar
            tus datos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SignedOut>
              <div className="flex min-h-[calc(20vh-5rem)] flex-col items-center justify-center">
                <NavUser />
              </div>
            </SignedOut>

            <SignedIn>
              <Button
                asChild // Convierte el botón en un enlace de Next.js
                variant="outline"
                className="bg-blue-200/20 text-blue-300 hover:bg-blue-950 hover:text-gray-50 border-blue-300/30 transition-all duration-200"
              >
                <Link href="/estudiantes">Gestionar Estudiantes</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="bg-blue-200/20 text-blue-300 hover:bg-blue-950 hover:text-gray-50 border-blue-300/30 transition-all duration-200"
              >
                <Link href="/horarios">Gestionar Horarios</Link>
              </Button>

              <Button
                asChild // Convierte el botón en un enlace de Next.js
                variant="outline"
                className="bg-blue-200/20 text-blue-300 hover:bg-blue-950 hover:text-gray-50 border-blue-300/30 transition-all duration-200"
              >
                <Link href="/maestros">Gestionar Maestros</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="bg-blue-200/20 text-blue-300 hover:bg-blue-950 hover:text-gray-50 border-blue-300/30 transition-all duration-200"
              >
                <Link href="/materias">Gestionar Materias</Link>
              </Button>

              <Button
                asChild // Convierte el botón en un enlace de Next.js
                variant="outline"
                className="bg-blue-200/20 text-blue-300 hover:bg-blue-950 hover:text-gray-50 border-blue-300/30 transition-all duration-200"
              >
                <Link href="/salones">Gestionar Salones</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="bg-blue-200/20 text-blue-300 hover:bg-blue-950 hover:text-gray-50 border-blue-300/30 transition-all duration-200"
              >
                <Link href="/calificaciones">Gestionar Calificaciones</Link>
              </Button>
            </SignedIn>
          </div>
          <p className="text-gray-400 text-sm">
            Esta aplicación te permite administrar la información de tu escuela
            de manera eficiente.
          </p>
        </CardContent>
      </Card><br />
      <p className=" text-base sm:text-lg md:text-xl">
        Tu solución centralizada para la gestión y visualización de datos.
      </p>
    </div>
  );
};

export default HomePage;
