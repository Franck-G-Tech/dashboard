"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react"; // Importa useEffect
import { useRouter } from "next/navigation";
import useNavigationStore from '@/store/navigationStore'; // Importa el store de navegación
import { Breadcrumb } from "@/components/ui/breadcrumb"; // Importa el componente Breadcrumb

type FormData = {
  numero: string;
  edificio: string;
  planta: string;
};

export default function NuevoSalonPage() {
  const [formData, setFormData] = useState<FormData>({
    numero: "",
    edificio: "",
    planta: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createMutation = useMutation(api.salones.crearSalon);
  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute); // Obtén la función setRoute

  useEffect(() => {
    // Define la ruta para la página de creación de salones
    setRoute([
      { label: 'School App', slug: '' },
      { label: 'Salones', slug: 'salones' },
      { label: 'Nuevo', slug: 'nuevo' },
    ]);
  }, [setRoute]); // Dependencia para que se ejecute solo al montar el componente

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createMutation(formData);
      router.push("/salones");
    } catch (err) {
      setError("Ocurrió un error al crear el Salon: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/salones");
  };

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      {/* Renderiza el componente Breadcrumb aquí */}
      <Breadcrumb className="mb-4" />

      <h1 className="text-2xl font-bold mb-6">Nuevo Salon</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Número</label>
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
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Salon"}
          </Button>
        </div>
      </form>
    </div>
  );
}