// components/ag-grid-renderers/DeleteButtonRenderer.tsx
"use client";

import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel"; // Asegúrate de que esta ruta sea correcta

// Definimos los props que recibirá nuestro componente
interface DeleteButtonRendererProps extends ICellRendererParams {
  onDelete: (id: Id<"users">) => void; // Función para manejar la eliminación
  user: {
    _id: Id<"users">;
    name: string;
    // Agrega cualquier otra propiedad de usuario que necesites para la descripción
  };
}

const DeleteButtonRenderer: React.FC<DeleteButtonRendererProps> = ({
  data, // 'data' contiene el objeto de la fila completa en AG Grid
  onDelete,
}) => {
  // Asegúrate de que 'data' exista y tenga las propiedades que esperas
  const user = data as DeleteButtonRendererProps['user']; // Casteamos data a nuestro tipo user si es necesario

  if (!user || !user._id || !user.name) {
    return null; // O un indicador de error si los datos no son correctos
  }

  return (
    <div className="flex items-center h-full justify-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              <span className="font-bold text-red-600"> {user.name} </span>
              y sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(user._id)}>
              Sí, eliminar usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteButtonRenderer;