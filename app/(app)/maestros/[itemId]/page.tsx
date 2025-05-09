"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

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
  const maestro = maestroData as Maestro | null | undefined;

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Detalles del Maestro</h1>
      <br />
      <div >
        {maestro ? (
          <>
            <p>
              <strong>Matrícula:</strong> {maestro.numeroEmpleado}
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
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 border rounded"
      >
        Volver
      </button>
    </div>
  );
}