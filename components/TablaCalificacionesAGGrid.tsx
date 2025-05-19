import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { type ColDef, ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
import { provideGlobalGridOptions } from "ag-grid-community";
provideGlobalGridOptions({ theme: "legacy" });
import { useTheme } from "next-themes";

// Registra los módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

// Definimos una interfaz para los datos que realmente recibirá la tabla
interface CalificacionConInfo {
  _id: string;
  _creationTime: number;
  alumnoId: string; // Aunque en la DB es v.Id, aquí será string después de la consulta
  materiaId: string; // Igual que alumnoId
  nota: number;
  semestre: string;
  estudiante?: { _id: string; nombre: string; numeroMatricula: string }; // Información del estudiante
  materia?: { _id: string; nombre: string; identificador: string };     // Información de la materia
}

interface TablaCalificacionesAGGridProps {
  calificacionesData: CalificacionConInfo[];
}

const TablaCalificacionesAGGrid: React.FC<TablaCalificacionesAGGridProps> = ({
  calificacionesData,
}) => {
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Num. Matrícula",
        valueGetter: (params) => params.data?.estudiante?.numeroMatricula || "N/A",
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
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={`ag-theme-quartz ${
        resolvedTheme === "light" ? "ag-theme-quartz" : "ag-theme-quartz-dark"
      }`}
      style={{ height: "300px", width: "81%", margin: "20px auto" }}
    >

      <AgGridReact
        rowData={calificacionesData}
        columnDefs={columnDefs}
        // pagination={true}
        //paginationPageSize={10}
      />
    </div>
  );
};

export default TablaCalificacionesAGGrid;