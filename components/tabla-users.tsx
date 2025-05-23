"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import { Id } from "@/convex/_generated/dataModel";
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
import { Trash2 } from "lucide-react";
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

export function TablaAdministradores() {
  const users = useQuery(api.users.obtenerUsers);
  const deleteUserAction = useAction(api.users.deleteUser);

  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/admin/${id}`);
  };
  const handleDelete = async (userId: Id<"users">) => {
    try {
      await deleteUserAction({ userId });
    } catch (error) {}
  };
  // Loading state with Skeleton
  if (users === undefined) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(4)].map(
                (
                  _,
                  i // Adjusted based on 4 columns
                ) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(4)].map(
                  (
                    _,
                    j // Adjusted based on 4 columns
                  ) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-[90%]" />
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
        <div className="flex justify-between p-4">
          <p className="text-lg font-semibold">Lista de Administradores</p>
          <div className="flex justify-end">
            <Button
              onClick={() => router.push(`/admin/create`)}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-400 hover:border-gray-500"
            >
              +
            </Button>
          </div>
        </div>

        <Table className="items-center justify-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              {/* <TableHead className="text-right">Acciones</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No hay administradores registrados.
                </TableCell>
              </TableRow>
            ) : (
              users.map(
                (
                  user // Explicitly type 'user' in map
                ) => (
                  <TableRow
                    key={user._id}
                    onDoubleClick={() => handleRowClick(user._id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={
                          user.status === "active"
                            ? "text-green-600 font-medium"
                            : user.status === "blocked"
                            ? "text-red-600 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {/*
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Editando a ${user.name}`);
                      }}
                      className="mr-2"
                    >
                      Editar
                    </Button>
                    */}
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(`¿Estás seguro de eliminar a ${user.name}?`)
                          ) {
                            alert(`Eliminando a ${user.name}`);
                            // Call your Convex mutation here to delete user:
                            // await yourDeleteMutation({ userId: user._id });
                          }
                        }}
                      >
                        <Trash2 />
                      </Button> */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          {/* Este es el botón que el usuario ve y hace clic para abrir el diálogo */}
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />{" "}
                            {/* Icono de la papelera */}
                            
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          {/* Contenido del Diálogo de Alerta */}
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Estás absolutamente seguro?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará
                              permanentemente al usuario
                              <span className="font-bold text-red-600">
                                {" "}
                                {user.name}{" "}
                              </span>
                              y sus datos asociados de nuestros servidores,
                              incluyendo Clerk.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            {/* Botón para cancelar la eliminación */}
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            {/* Botón para confirmar la eliminación - Llama a handleDelete cuando se hace clic */}
                            <AlertDialogAction
                              onClick={() => handleDelete(user._id)}
                            >
                              Sí, eliminar usuario
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
