"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

type Estudiante = {
  _id: Id<"estudiantes">;
  numeroMatricula: string; 
  nombre: string;
  correo: string;
};

type FormData = Omit<Estudiante, "_id">;

export default function EditarEstudiantePage() {
  const router = useRouter();
  const { itemId } = useParams<{ itemId: string }>();
  const estudiante = useQuery(api.estudiantes.obtenerEstudiantePorId, {
      id: itemId as Id<"estudiantes">, // Usa 'itemId' aquí también
    });

  const updateMutation = useMutation(api.estudiantes.actualizarEstudiante);
  const [formData, setFormData] = useState<FormData>({
    numeroMatricula: "",
    nombre: "",
    correo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (estudiante) {
      setFormData({
        numeroMatricula: estudiante.numeroMatricula,
        nombre: estudiante.nombre,
        correo: estudiante.correo,
      });
    }
  }, [estudiante]);


  if (!estudiante) {
    return <div>Estudiante no encontrado.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateMutation({
          id: estudiante._id,
          ...formData
        });
      router.push("/"); // Redirige a la página principal tras la edición exitosa
    } catch (err) {
      setError("Ocurrió un error al actualizar el estudiante: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/"); // Redirige a la página principal al cancelar
  };

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Editar Estudiante</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Matrícula</label>
          <Input
            name="numeroMatricula"
            value={formData.numeroMatricula}
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
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
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