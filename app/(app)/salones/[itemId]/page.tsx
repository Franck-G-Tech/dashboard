"use client";

import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

interface Salon {
  _id: Id<"salones">;
  _creationTime: number;
  numero: string;
  edificio: string;
  planta: string;
}

export default function DetalleSalon() {
  const { itemId } = useParams<{ itemId: string }>();
  const salonData = useQuery(api.salones.obtenerSalonPorId, {
    id: itemId as Id<"salones">,
  });

  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute
  const salon = salonData as Salon | null | undefined;

  useEffect(() => {
    if (salon?.numero && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Salones', slug: 'salones' },
        { label: salon.numero, slug: `salones/${itemId}` }, // Usa el número del salón
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Salones', slug: 'salones' },
        { label: 'Detalle', slug: `salones/${itemId}` },
      ]);
    }
  }, [salon?.numero, itemId, setRoute]);

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-3xl font-bold mb-6">Detalles del Salon</h1>
      <br />
      <div>
        {salon ? (
          <>
            <p>
              <strong>Número:</strong> {salon.numero}
            </p>
            <p>
              <strong>Edificio:</strong> {salon.edificio}
            </p>
            <p>
              <strong>Planta:</strong> {salon.planta}
            </p>

            <br />
            <div className="flex gap-10  justify-center">
              <button
                onClick={() => router.push(`/salones/${itemId}/edit`)}
                className="mt-4 px-4 py-2 border rounded"
              >
                Editar
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">Salon no encontrado.</p>
        )}
      </div>
      <br />
      
    </div>
  );
}