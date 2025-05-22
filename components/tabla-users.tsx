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
import { useRouter } from "next/navigation";

// Import the User type (assuming it's defined as shown above, e.g., in types/index.ts
// or defined directly in this file as demonstrated in the previous response)


export function TablaAdministradores() {
  // Fetch users (administrators) from Convex.
  // We explicitly type 'users' as an array of 'User' or undefined during loading.
  //const users: User[] | undefined = useQuery(api.users.obtenerUsers);
  const users = useQuery(api.users.obtenerUsers);

  const router = useRouter();

  // Function to handle row click (e.g., navigate to admin details page)
  const handleRowClick = (id: string) => {
    router.push(`/admin/${id}`);
  };

  // Loading state with Skeleton
  if (users === undefined) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(4)].map((_, i) => ( // Adjusted based on 4 columns
                <TableHead key={i}>
                  <Skeleton className="h-4 w-[120px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(4)].map((_, j) => ( // Adjusted based on 4 columns
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-[90%]" />
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
              users.map((user) => ( // Explicitly type 'user' in map
                <TableRow
                  key={user._id}
                  onClick={() => handleRowClick(user._id)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={
                      user.status === 'active' ? 'text-green-600 font-medium' :
                      user.status === 'blocked' ? 'text-red-600 font-medium' :
                      'text-gray-500'
                    }>
                      {user.status}
                    </span>
                  </TableCell>
                  {/* <TableCell className="text-right">
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
                          alert(`Eliminando a ${user.name}`);
                          // Call your Convex mutation here to delete user:
                          // await yourDeleteMutation({ userId: user._id });
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}