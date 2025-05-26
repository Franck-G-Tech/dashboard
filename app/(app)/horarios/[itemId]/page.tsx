"use client";

import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

interface Horario {
  _id: Id<"horarios">;
  _creationTime: number;
  periodo: string;
}

export default function DetalleHorario() {
  const { itemId } = useParams<{ itemId: string }>();
  const horarioData = useQuery(api.horarios.obtenerHorarioPorId, {
    id: itemId as Id<"horarios">,
  });

  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute
  const horario = horarioData as Horario | null | undefined;

  useEffect(() => {
    if (horario?.periodo && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Horarios', slug: 'horarios' },
        { label: horario.periodo, slug: `horarios/${itemId}` }, // Usa el periodo del horario
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Horarios', slug: 'horarios' },
        { label: 'Detalle', slug: `horarios/${itemId}` },
      ]);
    }
  }, [horario?.periodo, itemId, setRoute]);

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-3xl font-bold mb-6">Detalles del Horario</h1>
      <br />
      <div>
        {horario ? (
          <>
            <p>
              <strong>Periodo:</strong> {horario.periodo}
            </p>
            <br />
            <div className="flex gap-10  justify-center">
              <button
                onClick={() => router.push(`/horarios/${itemId}/edit`)}
                className="mt-4 px-4 py-2 border rounded"
              >
                Editar
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">Horario no encontrado.</p>
        )}
      </div>
      <br />
      
    </div>
  );
}