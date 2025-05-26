"use client";

import React, { useEffect } from "react"; 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useNavigationStore from '@/store/navigationStore';
import { Breadcrumb } from "@/components/ui/breadcrumb";
//import { TablaAdministradores } from "@/components/tabla-users"; // Assuming you'll create this component
import { TablaAdministradores } from "@/components/AGG-tabla-users";

export default function AdminsPage() {
  const setRoute = useNavigationStore((state) => state.setRoute);
  const router = useRouter();

  useEffect(() => {
    // Set the navigation route for administrators
    setRoute([
      { label: 'School App', slug: '' },
      { label: 'Administradores', slug: 'admins' }, // Adjusted slug for administrators
    ]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Gestión de Administradores</h1>
      <br />
      <Button
          onClick={() => router.push(`/admin/create`)}
          variant="outline"
          className="rounded-full border-gray-400 hover:border-blue-900"
          title="Agregar nuevo administrador"
        >
          Nuevo Administrador
        </Button>
      <TablaAdministradores /> 
    </div>
  );
}