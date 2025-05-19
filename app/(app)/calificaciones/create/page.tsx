"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useNavigationStore from '@/store/navigationStore';
import { Breadcrumb } from "@/components/ui/breadcrumb";
// import { type Calificacion, type Estudiante, type Materia } from "@/convex/schema"; // COMENTADO

type FormData = {
  alumnoId: "";
  materiaId: "";
  nota: number | null;
  semestre: string;
};

export default function NuevaCalificacionPage() {
  const [formData, setFormData] = useState<FormData>({
    alumnoId: "",
    materiaId: "",
    nota: null,
    semestre: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createMutation = useMutation(api.mutations.agregarCalificacion.agregarCalificacion);
  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute);

  // Obtener la lista de estudiantes para el selector
  const estudiantes= useQuery(api.estudiantes.obtenerEstudiantes);

  // Obtener la lista de materias para el selector
  const materias = useQuery(api.materias.obtenerMaterias);

  useEffect(() => {
    setRoute([
      { label: 'School App', slug: '' },
      { label: 'Calificaciones', slug: 'calificaciones' },
      { label: 'Nueva', slug: 'create' },
    ]);
  }, [setRoute]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { alumnoId, materiaId, nota, semestre } = formData;

    if (!alumnoId || !materiaId || nota === null || !semestre) {
      setError("Por favor, selecciona un estudiante, una materia, ingresa la nota y el semestre.");
      setIsSubmitting(false);
      return;
    }

    try {
      await createMutation({
        alumnoId,
        materiaId,
        nota,
        semestre,
      });
      router.push("/calificaciones");
    } catch (err) {
      setError("Ocurrió un error al agregar la calificación: " + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/calificaciones");
  };

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" />

      <h1 className="text-2xl font-bold mb-6">Nueva Calificación</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Estudiante</label>
          <select
            name="alumnoId"
            value={formData.alumnoId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary sm:text-sm"
            required
          >
            <option value="">Seleccionar estudiante</option>
            {estudiantes?.map((estudiante) => (
              <option key={estudiante._id} value={estudiante._id}>
                {estudiante.nombre} ({estudiante.numeroMatricula})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Materia</label>
          <select
            name="materiaId"
            value={formData.materiaId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary sm:text-sm"
            required
          >
            <option value="">Seleccionar materia</option>
            {materias?.map((materia) => (
              <option key={materia._id} value={materia._id}>
                {materia.nombre} ({materia.identificador})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Calificación</label>
          <Input
            name="nota"
            type="number"
            value={formData.nota === null ? "" : formData.nota}
            onChange={(e) => setFormData(prev => ({ ...prev, nota: Number(e.target.value) }))}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Semestre</label>
          <Input
            name="semestre"
            type="text"
            value={formData.semestre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Agregando..." : "Agregar Calificación"}
          </Button>
        </div>
      </form>
    </div>
  );
}