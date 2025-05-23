"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

type Maestro = {
  _id: Id<"maestros">;
  numeroEmpleado: string;
  nombre: string;
  correo: string;
};

type FormData = Omit<Maestro, "_id">;

export default function EditarMaestroPage() {
  const router = useRouter();
  const { itemId } = useParams<{ itemId: string }>();
  const maestro = useQuery(api.maestros.obtenerMaestroPorId, {
    id: itemId as Id<"maestros">,
  });

  const updateMutation = useMutation(api.maestros.actualizarMaestro);
  const [formData, setFormData] = useState<FormData>({
    numeroEmpleado: "",
    nombre: "",
    correo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute

  useEffect(() => {
    if (maestro?.nombre && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Maestros', slug: 'maestros' },
        { label: maestro.nombre, slug: `maestros/${itemId}/edit` }, // Usa el nombre del maestro
        { label: 'Editar', slug: 'maestros' },
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Maestros', slug: 'maestros' },
        { label: 'Editar', slug: `maestros/${itemId}/edit` },
      ]);
    }
  }, [maestro?.nombre, itemId, setRoute]);

  useEffect(() => {
    if (maestro) {
      setFormData({
        numeroEmpleado: maestro.numeroEmpleado,
        nombre: maestro.nombre,
        correo: maestro.correo,
      });
    }
  }, [maestro]);

  if (!maestro) {
    return <div>maestro no encontrado.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateMutation({
        id: maestro._id,
        ...formData,
      });
      router.push("/maestros");
    } catch (err) {
      setError("Ocurrió un error al actualizar el maestro: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/maestros");
  };

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-2xl font-bold mb-6">Editar maestro</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Empleado</label>
          <Input
            name="numeroEmpleado"
            value={formData.numeroEmpleado}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Nombre</label>
          <Input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Correo</label>
          <Input
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}