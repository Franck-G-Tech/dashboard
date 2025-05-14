"use client";

import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

interface Materia {
  _id: Id<"materias">;
  _creationTime: number;
  identificador: string;
  nombre: string;
}

export default function DetalleMateria() {
  const { itemId } = useParams<{ itemId: string }>();
  const materiaData = useQuery(api.materias.obtenerMateriaPorId, {
    id: itemId as Id<"materias">,
  });

  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute
  const materia = materiaData as Materia | null | undefined;

  useEffect(() => {
    if (materia?.nombre && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Materias', slug: 'materias' },
        { label: materia.nombre, slug: `materias/${itemId}` }, // Usa el nombre de la materia
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Materias', slug: 'materias' },
        { label: 'Detalle', slug: `materias/${itemId}` },
      ]);
    }
  }, [materia?.nombre, itemId, setRoute]);

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-3xl font-bold mb-6">Detalles de Materia</h1>
      <br />
      <div>
        {materia ? (
          <>
            <p>
              <strong>Identificador:</strong> {materia.identificador}
            </p>
            <p>
              <strong>Nombre:</strong> {materia.nombre}
            </p>
            <br />
            <div className="flex gap-10  justify-center">
              <button
                onClick={() => router.push(`/materias/${itemId}/edit`)}
                className="mt-4 px-4 py-2 border rounded"
              >
                Editar
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">Materia no encontrada.</p>
        )}
      </div>
      <br />
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 border rounded"
      >
        Volver
      </button>
    </div>
  );
}