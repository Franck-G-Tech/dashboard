"use client";

import * as React from "react";
//import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Collapsible,
  CollapsibleContent,
} from "./ui/collapsible";
import { Skeleton } from "./ui/skeleton";

export function TablaEstudiantes() {
  const estudiantes = useQuery(api.estudiantes.obtenerEstudiantes);
  const calificacionesData = useQuery(api.calificaciones.obtenerCalificaciones);
  const [openRows, setOpenRows] = React.useState<string[]>([]);
  const hasData = estudiantes !== undefined && calificacionesData !== undefined;

  interface CalificacionEstudiante {
    materia: string;
    nota: number;
    semestre: string;
}
  const calificacionesPorEstudiante = React.useMemo(() => {
        if (!hasData) {
            return {};
        }
        const grouped: Record<string, CalificacionEstudiante[]> = {};
        calificacionesData.forEach((calificacion) => {
            if (calificacion.estudiante?._id) {
                if (!grouped[calificacion.estudiante._id]) {
                    grouped[calificacion.estudiante._id] = [];
                }
                grouped[calificacion.estudiante._id].push({
                    materia: calificacion.materia?.nombreMateria || "N/A",
                    nota: calificacion.nota,
                    semestre: calificacion.semestre,
                });
            }
        });
        return grouped;
    }, [hasData, calificacionesData]);

  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/estudiantes/${id}`);
  };
  const toggleRow = (id: string) => {
    setOpenRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  if (estudiantes === undefined) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(3)].map(
                (
                  _,
                  i // Ajustado a 3 columnas principales
                ) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(3)].map(
                  (
                    _,
                    j // Ajustado a 3 celdas por fila
                  ) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-[80%]" />
                    </TableCell>
                  )
                )}
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
        <div className="flex justify-between items-center p-4">
          {" "}
          {/* Contenedor para título y botón */}
          <p className="text-lg font-semibold">Lista de Estudiantes</p>
          
            <Button
              onClick={() => router.push(`/estudiantes/create`)}
              variant="outline"
              className="rounded-full bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              Nuevo Estudiante
            </Button>
          
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
                <React.Fragment key={estudiante._id}>
                  <TableRow
                    // key={estudiante._id}
                    //- onClick={() => handleRowClick(estudiante._id)}
                    onClick={() => toggleRow(estudiante._id)}
                    onDoubleClick={() => handleRowClick(estudiante._id)}
                     style={{ cursor: 'pointer' }}
                  >
                    <TableCell className="font-medium">
                      {estudiante.numeroMatricula}
                    </TableCell>
                    <TableCell>{estudiante.nombre}</TableCell>
                    <TableCell>{estudiante.correo}</TableCell>                  
                  </TableRow>
                  {/* // */}
                  <TableRow>
                    <TableCell colSpan={4} className="p-0 border-0">
                      <Collapsible open={openRows.includes(estudiante._id)}>
                        <CollapsibleContent>
                          <div className="pl-6 py-2">
                            <h3 className="text-sm font-semibold mb-2">
                              Calificaciones de {estudiante.nombre}
                            </h3>
                            {calificacionesPorEstudiante[estudiante._id]
                              ?.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Materia</TableHead>
                                    <TableHead>Nota</TableHead>
                                    <TableHead>Semestre</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {calificacionesPorEstudiante[
                                    estudiante._id
                                  ]?.map((calificacion, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {calificacion.materia}
                                      </TableCell>
                                      <TableCell>{calificacion.nota}</TableCell>
                                      <TableCell>
                                        {calificacion.semestre}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Este estudiante no tiene calificaciones
                                registradas.
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
