"use client";

import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

interface Estudiante {
  _id: Id<"estudiantes">;
  _creationTime: number;
  numeroMatricula: string;
  nombre: string;
  correo: string;
}

export default function DetalleEstudiante() {
  const { itemId } = useParams<{ itemId: string }>();
  const estudianteData = useQuery(api.estudiantes.obtenerEstudiantePorId, {
    id: itemId as Id<"estudiantes">,
  });

  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute
  const estudiante = estudianteData as Estudiante | null | undefined;

  useEffect(() => {
    if (estudiante?.nombre) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Estudiantes', slug: 'estudiantes' },
        { label: estudiante.nombre, slug: `estudiantes/${itemId}` }, // Usa el nombre del estudiante
      ]);
    } else if (itemId) {
      // Mostrar algo mientras se carga el nombre o si no se encuentra el estudiante
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Estudiantes', slug: 'estudiantes' },
        { label: 'Detalle', slug: `estudiantes/${itemId}` },
      ]);
    }
  }, [estudiante?.nombre, itemId, setRoute]);

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-3xl font-bold mb-6">Detalles del Estudiante</h1>
      <br />
      <div>
        {estudiante ? (
          <>
            <p>
              <strong>Matrícula:</strong> {estudiante.numeroMatricula}
            </p>
            <p>
              <strong>Nombre:</strong> {estudiante.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {estudiante.correo}
            </p>

            <br />
            <div className="flex gap-10  justify-center">
              <button
                onClick={() => router.push(`/estudiantes/${itemId}/edit`)}
                className="mt-4 px-4 py-2 border rounded"
              >
                Editar
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">Estudiante no encontrado.</p>
        )}
      </div>
      <br />
      
    </div>
  );
}