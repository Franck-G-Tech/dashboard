"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

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
  const horario = horarioData as Horario | null | undefined;

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Detalles del Horario</h1>
      <br />
      <div >
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
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 border rounded"
      >
        Volver
      </button>
    </div>
  );
}