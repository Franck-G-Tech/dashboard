"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Id, Doc } from "@/convex/_generated/dataModel";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import React, { useMemo, useCallback } from "react"; // <-- IMPORTA useCallback
import { useTheme } from "next-themes";

// AG Grid Imports
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ICellRendererParams,
  RowDoubleClickedEvent,
  ModuleRegistry,
  //ClientSideRowModelModule,
  AllCommunityModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { provideGlobalGridOptions } from "ag-grid-community";
provideGlobalGridOptions({ theme: "legacy" });

//ModuleRegistry.registerModules([ClientSideRowModelModule]);
ModuleRegistry.registerModules([AllCommunityModule]);

import DeleteButtonRenderer from "@/components/ag-grid-renderers/DeleteButtonRenderer";

type User = Doc<"users">;

export function TablaAdministradores() {
  const users = useQuery(api.users.obtenerUsers);
  const deleteUserAction = useAction(api.users.deleteUser);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  // **SOLUCIÓN**: Envuelve handleDelete en useCallback
  const handleDelete = useCallback(
    async (userId: Id<"users">) => {
      try {
        await deleteUserAction({ userId });
        console.log(`Usuario ${userId} eliminado exitosamente.`);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert(`Fallo al eliminar el usuario: ${error || String(error)}`);
      }
    },
    [deleteUserAction] // Dependencias de useCallback. Solo se recrea si deleteUserAction cambia.
  );

  // Definición de las columnas para AG Grid
  const colDefs: ColDef<User>[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        sortable: true,
        filter: true,
        flex: 2,
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 3,
      },
      {
        field: "status",
        headerName: "Estado",
        sortable: true,
        filter: true,
        flex: 1,
        cellRenderer: (params: ICellRendererParams<User, User["status"]>) => {
          const status = params.value;
          let className = "font-medium";
          if (status === "active") {
            className += " text-green-600";
          } else if (status === "blocked") {
            className += " text-red-600";
          } else if (status === "deleted") {
            className += " text-gray-500";
          }
          return <span className={className}>{status}</span>;
        },
      },
      {
        headerName: "Acciones",
        field: "_id",
        cellRenderer: DeleteButtonRenderer,
        cellRendererParams: {
          onDelete: handleDelete, // handleDelete es ahora una función memorizada
        },
        minWidth: 120,
        maxWidth: 150,
        resizable: false,
        sortable: false,
        filter: false,
        floatingFilter: false,
        editable: false,
      },
    ],
    // Dependencias de useMemo. handleDelete es una dependencia, pero como está en useCallback,
    // solo cambia cuando deleteUserAction cambia, lo cual es raro.
    [handleDelete]
  );

  const onRowDoubleClicked = (event: RowDoubleClickedEvent<User>) => {
    if (event.data && event.data._id) {
      router.push(`/admin/${event.data._id}`);
    }
  };

  if (users === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(90vh-5rem)] p-4">
        <p className="text-lg font-semibold mb-4">
          Cargando administradores...
        </p>
        <Skeleton className="w-full max-w-4xl h-[400px] rounded-md border" />
      </div>
    );
  }

  return (
      <div
        className={`ag-theme-quartz ${
          resolvedTheme === "light" ? "ag-theme-quartz" : "ag-theme-quartz-dark"
        }`}
        style={{ height: "350px", width: "81%", margin: "20px auto" }}
      >
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-full text-lg text-gray-500">
            No hay administradores registrados.
          </div>
        ) : (
          <AgGridReact<User>
            rowData={users}
            columnDefs={colDefs}
            onRowDoubleClicked={onRowDoubleClicked}
            animateRows={true}
            rowSelection="single"
          />
        )}
      </div>
    
  );
}
