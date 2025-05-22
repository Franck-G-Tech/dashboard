"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useAction } from "convex/react"; // ¡Agrega useAction!
import { api } from "@/convex/_generated/api"; // Asegúrate de que esta importación sea correcta
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import useNavigationStore from '@/store/navigationStore';
import { Breadcrumb } from "@/components/ui/breadcrumb";


// Define el tipo para los datos del formulario
type FormData = {
  name: string;
  email: string;
  status: 'active' | 'blocked' | 'deleted';
};

export default function EditarUsuarioPage() {
  const router = useRouter();
  const { itemId } = useParams<{ itemId: string }>();

  // Carga los datos del usuario para pre-llenar el formulario
  const user = useQuery(api.users.getUserById, {
    id: itemId as Id<"users">,
  });

  // *** CAMBIO CLAVE AQUÍ: Declara DOS hooks de mutación/acción ***
  // 1. Para campos que solo actualizan Convex (name, status)
  const updateConvexFieldsMutation = useMutation(api.users.updateUser);
  // 2. Para el email, que actualiza Clerk Y Convex
  const updateEmailAction = useAction(api.users.updateUserInClerkAndConvex);


  // Estado para manejar las entradas del formulario
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setRoute = useNavigationStore((state) => state.setRoute);

  // Efecto para popular los campos del formulario cuando se cargan los datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        status: user.status as 'active' | 'blocked' | 'deleted',
      });
    }
  }, [user]);

  // Efecto para actualizar los breadcrumbs
  useEffect(() => {
    if (user?.name && itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Administradores', slug: 'admin' },
        { label: user.name, slug: `admin/${itemId}` },
        { label: 'Editar', slug: `admin/${itemId}/edit` },
      ]);
    } else if (itemId) {
      setRoute([
        { label: 'School App', slug: '' },
        { label: 'Administradores', slug: 'admin' },
        { label: 'Editar', slug: `admin/${itemId}/edit` },
      ]);
    }
  }, [user?.name, itemId, setRoute]);

  // --- Renderizado de estados de carga/no encontrado ---
  if (user === undefined) {
    return (
      <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
        <p>Cargando datos del usuario para editar...</p>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center">
        <p className="text-red-500">Usuario no encontrado.</p>
      </div>
    );
  }

  // --- Handlers para las entradas del formulario ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: 'active' | 'blocked' | 'deleted') => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  // --- Handler para el envío del formulario ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 1. Determinar qué campos han cambiado para Convex-only
    const updatesForConvexOnly: Partial<FormData> = {};
    if (formData.name !== user.name) {
      updatesForConvexOnly.name = formData.name;
    }
    if (formData.status !== user.status) {
      updatesForConvexOnly.status = formData.status;
    }

    // 2. Determinar si el email ha cambiado (para el llamado a Clerk)
    const emailChanged = formData.email !== user.email;

    try {
      // PRIMER LLAMADO (CONDICIONAL): Actualizar campos que solo afectan a Convex (nombre, estado)
      if (Object.keys(updatesForConvexOnly).length > 0) {
        console.log("DEPURACIÓN: Actualizando solo Convex:", updatesForConvexOnly);
        await updateConvexFieldsMutation({
          id: user._id,
          // Aquí solo pasamos 'name' y 'status'
          ...updatesForConvexOnly,
        });
      }

      // SEGUNDO LLAMADO (CONDICIONAL): Actualizar el email (afecta a Clerk y luego a Convex)
      if (emailChanged) {
        if (!user.clerkId) {
            // Este es un error crítico si el usuario en Convex no tiene Clerk ID
            throw new Error("Error: El usuario no tiene un ID de Clerk asociado. No se puede actualizar el correo en Clerk.");
        }
        console.log("DEPURACIÓN: Actualizando email en Clerk y Convex:", formData.email);
        await updateEmailAction({
          userId: user._id,      // ID de Convex del usuario
          clerkId: user.clerkId, // ID de Clerk del usuario
          newEmail: formData.email,
        });
      }
      
      // Si todo fue bien, redirigir
      router.push(`/admin/${itemId}`); 

    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      // Muestra un mensaje de error amigable
      setError("Ocurrió un error al actualizar el usuario: " + (err || String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handler del botón Cancelar ---
  const handleCancel = () => {
    router.push(`/admin/${itemId}`); // Regresar a la página de detalles del usuario sin guardar
  };

  return (
    <div className="flex min-h-[calc(90vh-5rem)] flex-col items-center justify-center p-4">
      <Breadcrumb className="mb-4" />
      <h1 className="text-2xl font-bold mb-6">Editar Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium">Estado</label>
          <Select name="status" value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
              <SelectItem value="deleted">Eliminado</SelectItem>
            </SelectContent>
          </Select>
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