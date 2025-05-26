"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useNavigationStore from "@/store/navigationStore";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import TablaCalificacionesAGGrid from "@/components/TablaCalificacionesAGGrid";

export default function CalificacionesPage() {
  const setRoute = useNavigationStore((state) => state.setRoute);
  const router = useRouter();

  useEffect(() => {
    setRoute([
      { label: "School App", slug: "" },
      { label: "Calificaciones", slug: "calificaciones" },
    ]);
  }, [setRoute]);

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Calificaciones</h1>
      <br />
        <Button
          onClick={() => router.push(`/calificaciones/create`)}
          variant="outline"
          className="rounded-full border-gray-400 hover:border-blue-900"
          title="Registrar Calificación"
        >
          Registrar Calificación
        </Button>
      <TablaCalificacionesAGGrid />
    </div>
  );
}
