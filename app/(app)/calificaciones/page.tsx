"use client";

import React, { useEffect, useState } from "react";
import TablaCalificacionesAGGrid from "@/components/TablaCalificacionesAGGrid";
import Link from "next/link";
import useNavigationStore from "@/store/navigationStore";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Calificacion {
  _id: string;
  //_creationTime: number;
  alumnoId: string;
  materiaId: string;
  nota: number;
  semestre: string;
  estudiante: {
    _id: string;
    nombre: string;
    numeroMatricula: string;
  } | null;
  materia: {
    _id: string;
    nombreMateria: string;
    identificador: string;
  } | null;
}

export default function CalificacionesPage() {
  const setRoute = useNavigationStore((state) => state.setRoute);
  //const [calificaciones, setCalificaciones] = useState<any[] | null>(null); // Usar any[] o el tipo de tus calificaciones

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setRoute([
      { label: "School App", slug: "" },
      { label: "Calificaciones", slug: "calificaciones" },
    ]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" />
      <h1 className="text-3xl font-bold mb-6">Sistema de Calificaciones</h1>
      <div className="flex justify-end">
        <Button
          onClick={() => router.push(`/calificaciones/create`)}
          variant="outline"
          className="rounded-full border-gray-400 hover:border-gray-500"
        >
          Registrar calificacion
        </Button>
      </div>

      <br />

      <TablaCalificacionesAGGrid />
      <br />
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
          "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
          "[&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
        )}
      >
        <Link href="/">Ir a inicio</Link>
      </button>
    </div>
  );
}
