// app/signup/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useNavigationStore from "@/store/navigationStore";
import { Breadcrumb } from "@/components/ui/breadcrumb";

type SignUpFormData = {
  name: string;
  email: string;
  // password: string;
};

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    // password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserAction = useAction(api.users.createUser);
  const router = useRouter();

  const setRoute = useNavigationStore((state) => state.setRoute);

  useEffect(() => {
    setRoute([
      { label: "School App", slug: "" },
      { label: "Administradores", slug: "admin" },
      { label: "Nuevo Usuario", slug: "signup" },
    ]);
  }, [setRoute]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createUserAction(formData);

      if (result) {
        console.log("Usuario registrado:", result);
        router.push("/admin");
      }
    } catch (err) {
      console.error("Error al registrar usuario:", err);

      let errorMessageToDisplay = "Ocurrió un error inesperado al registrar el usuario.";

      // --- KEY CHANGE HERE: Parse the error message ---
      if (err) {
        // This regex looks for: "Uncaught Error: [YOUR_MESSAGE] at handler"
        
          // Fallback if the specific pattern isn't found
          errorMessageToDisplay = "Este correo electrónico ya está registrado";
        
      }

      setError(errorMessageToDisplay);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <Breadcrumb className="mb-4" />
      <h1 className="text-2xl font-bold mb-6">Registro de Nuevo Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre Completo
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Correo Electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div> */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </Button>
        </div>
      </form>
    </div>
  );
}