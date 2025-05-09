"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

interface Salon {
  _id: Id<"salones">;
  _creationTime: number;
  numeroEmpleado: string;
  nombre: string;
  correo: string;
}

export default function DetalleSalon() {
  const { itemId } = useParams<{ itemId: string }>();
  const salonData = useQuery(api.salones.obtenerSalonPorId, {
    id: itemId as Id<"salones">,
  });

  const router = useRouter();
  const salon = salonData as Salon | null | undefined;

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Detalles del Salon</h1>
      <br />
      <div >
        {salon ? (
          <>
            <p>
              <strong>Matrícula:</strong> {salon.numeroEmpleado}
            </p>
            <p>
              <strong>Nombre:</strong> {salon.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {salon.correo}
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
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 border rounded"
      >
        Volver
      </button>
    </div>
  );
}