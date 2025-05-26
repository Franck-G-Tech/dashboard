"use client";

import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

interface Maestro {
  _id: Id<"maestros">;
  _creationTime: number;
  numeroEmpleado: string;
  nombre: string;
  correo: string;
}

export default function DetalleMaestro() {
  const { itemId } = useParams<{ itemId: string }>();
  const maestroData = useQuery(api.maestros.obtenerMaestroPorId, {
    id: itemId as Id<"maestros">,
  });

  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute
  const maestro = maestroData as Maestro | null | undefined;

  useEffect(() => {
    if (maestro?.nombre && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Maestros', slug: 'maestros' },
        { label: maestro.nombre, slug: `maestros/${itemId}` }, // Usa el nombre del maestro
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Maestros', slug: 'maestros' },
        { label: 'Detalle', slug: `maestros/${itemId}` },
      ]);
    }
  }, [maestro?.nombre, itemId, setRoute]);

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-3xl font-bold mb-6">Detalles del Maestro</h1>
      <br />
      <div>
        {maestro ? (
          <>
            <p>
              <strong>Número de Empleado:</strong> {maestro.numeroEmpleado}
            </p>
            <p>
              <strong>Nombre:</strong> {maestro.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {maestro.correo}
            </p>

            <br />
            <div className="flex gap-10  justify-center">
              <button
                onClick={() => router.push(`/maestros/${itemId}/edit`)}
                className="mt-4 px-4 py-2 border rounded"
              >
                Editar
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">Maestro no encontrado.</p>
        )}
      </div>
      <br />
      
    </div>
  );
}