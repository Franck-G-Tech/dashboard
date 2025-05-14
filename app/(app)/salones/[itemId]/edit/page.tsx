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

type Salon = {
  _id: Id<"salones">;
  numero: string;
  edificio: string;
  planta: string;
};

type FormData = Omit<Salon, "_id">;

export default function EditarSalonPage() {
  const router = useRouter();
  const { itemId } = useParams<{ itemId: string }>();
  const salon = useQuery(api.salones.obtenerSalonPorId, {
    id: itemId as Id<"salones">,
  });

  const updateMutation = useMutation(api.salones.actualizarSalon);
  const [formData, setFormData] = useState<FormData>({
    numero: "",
    edificio: "",
    planta: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute

  useEffect(() => {
    if (salon?.numero && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Salones', slug: 'salones' },
        { label: salon.numero, slug: `salones/${itemId}/edit` }, // Usa el número del salón
        { label: 'Edit', slug: 'salones' },
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Salones', slug: 'salones' },
        { label: 'Editar', slug: `salones/${itemId}/edit` },
      ]);
    }
  }, [salon?.numero, itemId, setRoute]);

  useEffect(() => {
    if (salon) {
      setFormData({
        numero: salon.numero,
        edificio: salon.edificio,
        planta: salon.planta,
      });
    }
  }, [salon]);

  if (!salon) {
    return <div>salon no encontrado.</div>;
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
        id: salon._id,
        ...formData,
      });
      router.push("/salones");
    } catch (err) {
      setError("Ocurrió un error al actualizar el salon: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/salones");
  };

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" /> {/* Renderiza el Breadcrumb */}
      <h1 className="text-2xl font-bold mb-6">Editar salon</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Numero</label>
          <Input
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Edificio</label>
          <Input
            name="edificio"
            value={formData.edificio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Planta</label>
          <Input
            name="planta"
            value={formData.planta}
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