import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { type ColDef, ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
import { provideGlobalGridOptions } from "ag-grid-community";
provideGlobalGridOptions({ theme: "legacy" });
import { useTheme } from "next-themes";
import { ConvexClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


// Registra los módulos de AG Grid

ModuleRegistry.registerModules([AllCommunityModule]);

// Definimos una interfaz para los datos que realmente recibirá la tabla
interface CalificacionConInfo {
  _id: string;
  //_creationTime: number;
  alumnoId: string;
  materiaId: string;
  nota: number;
  semestre: string;
  estudiante: {
    _id: string;
    nombre: string;
    numeroMatricula: string;
  } | null;
  materia: {
    _id: string;
    nombreMateria: string;
    identificador: string;
  } | null;
}

export default function TablaCalificacionesAGGrid() {
  const fetchCalificaciones = async () => {
    try {
      const data = await fetchQuery(api.calificaciones.obtenerCalificaciones);
      setCalificaciones(data);
    } catch (error) {
      console.error("Error al obtener las calificaciones:", error);
      throw error; // Re-lanzar el error para que el componente lo maneje
    }
  };
  useEffect(() => {
    if (convex) {
      fetchCalificaciones();
    }
  }, [convex]);
  const [calificaciones, setCalificaciones] = useState<
    CalificacionConInfo[] | null
  >(null);
  const { resolvedTheme } = useTheme();
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Num. Matrícula",
        valueGetter: (params) =>
          params.data?.estudiante?.numeroMatricula || "N/A",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Estudiante",
        valueGetter: (params) => params.data?.estudiante?.nombre || "N/A",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Materia",
        valueGetter: (params) => params.data?.materia?.nombreMateria || "N/A",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Nota",
        field: "nota",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Semestre",
        field: "semestre",
        sortable: true,
        filter: true,
      },
    ],
    []
  );

  return (
    <div
      className={`ag-theme-quartz ${
        resolvedTheme === "light" ? "ag-theme-quartz" : "ag-theme-quartz-dark"
      }`}
      style={{ height: "300px", width: "81%", margin: "20px auto" }}
    >
      <AgGridReact
        rowData={calificaciones}
        columnDefs={columnDefs}
        // pagination={true}
        //paginationPageSize={10}

        // columnDefs={columnDefs}
        //   defaultColDef={defaultColDef}
        //   pagination={true}
        //   paginationPageSize={10}
        //   animateRows={true}
        //   rowSelection="single"
      />
    </div>
  );
}
