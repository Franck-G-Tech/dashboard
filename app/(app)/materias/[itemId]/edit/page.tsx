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

type Materia = {
  _id: Id<"materias">;
  identificador: string;
  nombre: string;
};

type FormData = Omit<Materia, "_id">;

export default function EditarMateriaPage() {
  const router = useRouter();
  const { itemId } = useParams<{ itemId: string }>();
  const materia = useQuery(api.materias.obtenerMateriaPorId, {
    id: itemId as Id<"materias">,
  });

  const updateMutation = useMutation(api.materias.actualizarMateria);
  const [formData, setFormData] = useState<FormData>({
    identificador: "",
    nombre: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute

  useEffect(() => {
    if (materia?.nombre && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Materias', slug: 'materias' },
        { label: materia.nombre, slug: `materias/${itemId}/edit` }, // Usa el nombre de la materia
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Materias', slug: 'materias' },
        { label: 'Editar', slug: `materias/${itemId}/edit` },
      ]);
    }
  }, [materia?.nombre, itemId, setRoute]);

  useEffect(() => {
    if (materia) {
      setFormData({
        identificador: materia.identificador,
        nombre: materia.nombre,
      });
    }
  }, [materia]);

  if (!materia) {
    return <div>materia no encontrada.</div>;
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
        id: materia._id,
        ...formData,
      });
      router.push("/materias/"); // Redirige a la página principal tras la edición exitosa
    } catch (err) {
      setError("Ocurrió un error al actualizar la materia: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/materias/"); // Redirige a la página al cancelar
  };

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-2xl font-bold mb-6">Editar Materia</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Identificador</label>
          <Input
            name="identificador"
            value={formData.identificador}
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