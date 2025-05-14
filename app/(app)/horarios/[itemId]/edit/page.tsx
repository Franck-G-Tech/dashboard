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

type Horario = {
  _id: Id<"horarios">;
  periodo: string;
};

type FormData = Omit<Horario, "_id">;

export default function EditarHorarioPage() {
  const router = useRouter();
  const { itemId } = useParams<{ itemId: string }>();
  const horario = useQuery(api.horarios.obtenerHorarioPorId, {
    id: itemId as Id<"horarios">,
  });

  const updateMutation = useMutation(api.horarios.actualizarHorario);
  const [formData, setFormData] = useState<FormData>({
    periodo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute

  useEffect(() => {
    if (horario?.periodo && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Horarios', slug: 'horarios' },
        { label: horario.periodo, slug: `horarios/${itemId}/edit` }, // Usa el periodo
        { label: 'Editar', slug: 'horarios' },
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Horarios', slug: 'horarios' },
        { label: 'Editar', slug: `horarios/${itemId}/edit`},
      ]);
    }
  }, [horario?.periodo, itemId, setRoute]);

  useEffect(() => {
    if (horario) {
      setFormData({
        periodo: horario.periodo,
      });
    }
  }, [horario]);

  if (!horario) {
    return <div>horario no encontrado.</div>;
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
        id: horario._id,
        ...formData,
      });
      router.push("/horarios"); // Redirige a la página principal tras la edición exitosa
    } catch (err) {
      setError("Ocurrió un error al actualizar el horario: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/horarios"); // Redirige a la página principal al cancelar
  };

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-2xl font-bold mb-6">Editar Horario</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Periodo</label>
          <Input
            name="periodo"
            value={formData.periodo}
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