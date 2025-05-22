"use client";

import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel"; // Import Id type
import useNavigationStore from '@/store/navigationStore';
import { Breadcrumb } from "@/components/ui/breadcrumb";


export default function DetalleUsuario() {
  // Get the item ID from the URL parameters
  const { itemId } = useParams<{ itemId: string }>();

  // Fetch user data from Convex using the new getUserById query
  // Cast itemId to Id<"users"> for type safety with Convex
  const userData = useQuery(api.users.getUserById, {
    id: itemId as Id<"users">,
  });

  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute);

  // Effect to update breadcrumbs
  useEffect(() => {
    if (userData?.name && itemId) {
      // If user data is loaded, use the user's name in the breadcrumb
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Administradores', slug: 'admin' },
        { label: userData.name, slug: `admin/${itemId}` },
      ]);
    } else if (itemId) {
      // If user data is still loading or not found, use a generic label
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Administradores', slug: 'admin' },
        { label: 'Detalle', slug: `admin/${itemId}` },
      ]);
    }
  }, [userData?.name, itemId, setRoute]); // Depend on userData.name and itemId

  // Render loading state
  if (userData === undefined) {
    return (
      <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
        <p>Cargando detalles del usuario...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center p-4">
      <Breadcrumb className="mb-4" />
      <h1 className="text-3xl font-bold mb-6">Detalles del Usuario</h1>
      <br />
      <div>
        {userData ? (
          <>
            <p>
              <strong>Nombre:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Estado:</strong>
              <span className={
                userData.status === 'active' ? 'text-green-600 font-medium ml-1' :
                userData.status === 'blocked' ? 'text-red-600 font-medium ml-1' :
                'text-gray-500 ml-1'
              }>
                {userData.status}
              </span>
            </p>
            {/* You can add more user details here */}
            {userData.clerkId && ( // Only show if clerkId exists
              <p>
                <strong>Clerk ID:</strong> {userData.clerkId}
              </p>
            )}
            {/* Display createdAt if needed, formatted for readability */}
            {userData._creationTime && (
              <p>
                <strong>Fecha de Creación:</strong> {new Date(userData._creationTime).toLocaleDateString()}
              </p>
            )}

            <br />
            <div className="flex gap-10 justify-center">
              <button
                onClick={() => router.push(`/admin/${itemId}/edit`)}
                className="mt-4 px-4 py-2 border rounded"
              >
                Editar Usuario
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-500">Usuario no encontrado.</p>
        )}
      </div>
      <br />
      <button
        onClick={() => router.back()} // Use router.back() for Next.js navigation
        className="mt-4 px-4 py-2 border rounded"
      >
        Volver
      </button>
    </div>
  );
}