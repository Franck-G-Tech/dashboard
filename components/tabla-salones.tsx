"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation"; // Importa useRouter

export function TablaSalones() {
  const salons = useQuery(api.salones.obtenerSalones);

  const router = useRouter(); // Inicializa el router de Next.js

  // Función para manejar el clic en una fila
  const handleRowClick = (id: string) => {
    router.push(`/salons/${id}`);
  };

  // Estado de carga mejorado
  if (salons === undefined) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(6)].map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(6)].map((_, j) => (
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
        <div className="flex justify-between p-4">
          <p className="text-lg font-semibold">Lista de Salones</p>
          <div className="flex justify-end"><Button
              onClick={() => router.push(`/salons/create`)}
              variant="outline" // Usa el estilo "outline" para el borde
              size="icon" // Usa un tamaño "icon" si lo tienes definido en tu Button
              className="rounded-full border-gray-400 hover:border-gray-500" // Estilos circulares y de borde
            >+
              
            </Button></div>
        </div>

        <Table className=" items-center justify-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Numero</TableHead>
              <TableHead>Edificio</TableHead>
              <TableHead>Planta</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {salons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No hay salones registrados
                </TableCell>
              </TableRow>
            ) : (
              salons.map((salon) => (
                <TableRow
                  key={salon._id}
                  onClick={() => handleRowClick(salon._id)}
                >
                  <TableCell className="font-medium">
                    {salon.numero}
                  </TableCell>
                  <TableCell>{salon.edificio}</TableCell>
                  <TableCell>{salon.planta}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
