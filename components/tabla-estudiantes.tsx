"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function TablaEstudiantes() {
  const estudiantes = useQuery(api.estudiantes.obtenerEstudiantes);
  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/estudiantes/${id}`);
  };

  if (estudiantes === undefined) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(3)].map((_, i) => ( // Ajustado a 3 columnas principales
                <TableHead key={i}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(3)].map((_, j) => ( // Ajustado a 3 celdas por fila
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border w-4/5">
      <div className="flex flex-col p-4">
        <div className="flex justify-between items-center p-4"> {/* Contenedor para título y botón */}
          <p className="text-lg font-semibold">Lista de Estudiantes</p>
          <div className="flex justify-end">
          <Button
              onClick={() => router.push(`/estudiantes/create`)}
              variant="outline" // Usa el estilo "outline" para el borde
              size="icon" // Usa un tamaño "icon" si lo tienes definido en tu Button
              className="rounded-full border-gray-400 hover:border-gray-500" // Estilos circulares y de borde
            >+
               
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Matrícula</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estudiantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No hay estudiantes registrados
                </TableCell>
              </TableRow>
            ) : (
              estudiantes.map((estudiante) => (
                <TableRow
                  key={estudiante._id}
                  onClick={() => handleRowClick(estudiante._id)}
                  
                >
                  <TableCell className="font-medium">
                    {estudiante.numeroMatricula}
                  </TableCell>
                  <TableCell>{estudiante.nombre}</TableCell>
                  <TableCell>{estudiante.correo}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}