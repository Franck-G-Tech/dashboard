"use client";

import React, { useEffect, useState } from "react";
import TablaCalificacionesAGGrid from "@/components/TablaCalificacionesAGGrid";
import Link from "next/link";
import useNavigationStore from "@/store/navigationStore";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
// Importa tu cliente de Convex y la función fetchCalificaciones
import { ConvexClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
interface Calificacion {
  _id: string;
  //_creationTime: number;
  alumnoId: string;
  materiaId:  string;
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

export const fetchCalificaciones = async () => {
  try {
    const calificaciones = await convex.query(api.calificaciones.obtenerCalificaciones, {}); // Pasa un objeto vacío como argumento
    return calificaciones;
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    throw error; // Re-lanzar el error para que el componente lo maneje
  }
};


export default function CalificacionesPage() {
  const setRoute = useNavigationStore((state) => state.setRoute);
  //const [calificaciones, setCalificaciones] = useState<any[] | null>(null); // Usar any[] o el tipo de tus calificaciones
  const [calificaciones, setCalificaciones] = useState<Calificacion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setRoute([
      { label: "School App", slug: "" },
      { label: "Calificaciones", slug: "calificaciones" },
    ]);
  }, [setRoute]);

  useEffect(() => {
    const getCalificaciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCalificaciones();
        setCalificaciones(data);
      } catch (err) {
        setError("Ocurrió un error al obtener las calificaciones.");
      } finally {
        setLoading(false);
      }
    };
    getCalificaciones();
  }, []);

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
      {loading && <div>Cargando calificaciones...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && calificaciones && (
        <TablaCalificacionesAGGrid calificacionesData={calificaciones} />
      )}
      <br />
      <button  className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
          "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
          "[&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
        )}>
        <Link href="/">Ir a inicio</Link>
      </button>
    </div>
  );
}

