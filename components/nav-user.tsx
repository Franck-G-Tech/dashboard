// components/nav-user.tsx
"use client";

import {
  UserPlus2,
  ChevronsUpDown,
  UserRoundCog,
  LogOut,
  ScanFace,
} from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react"; // <-- Importamos useRef

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// ====================================================================
// IMPORTACIONES DE CLERK
import {
  useUser,
  useClerk,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
// ====================================================================

// Ya no recibe 'user' como prop, lo obtiene de Clerk
export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, isSignedIn, isLoaded } = useUser(); // <-- Aseguramos isLoaded para el estado de carga del usuario de Clerk
  const { signOut } = useClerk();

  // Ref para el input de archivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejador del cambio de archivo para Clerk
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // Verificamos que haya un archivo y que el usuario de Clerk esté cargado y disponible
    if (!file || !user || !isLoaded) {
      console.error(
        "No se seleccionó ningún archivo o el usuario de Clerk no está cargado."
      );
      return;
    }

    // Opcional: Validar tipo de archivo y tamaño antes de subir a Clerk
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen.");
      return;
    }
    // Clerk tiene sus propios límites de tamaño de archivo (generalmente 5MB).
    // Puedes añadir una validación temprana aquí si lo deseas.
    if (file.size > 5 * 1024 * 1024) {
      // Ejemplo: 5MB
      alert("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    try {
      // Usar la API de Clerk para actualizar la foto de perfil
      await user.setProfileImage({ file });

      alert("¡Foto de perfil actualizada exitosamente en Clerk!");
      // Clerk se encarga de actualizar user.imageUrl y el componente se re-renderizará automáticamente.
    } catch (error) {
      console.error("Error al actualizar la foto de perfil en Clerk:", error);
      alert(
        `Fallo al actualizar la foto de perfil: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      // Limpiar el input para permitir subir la misma imagen de nuevo si es necesario
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Función auxiliar para obtener la información del usuario de Clerk de forma segura
  const getUserDisplayInfo = () => {
    // Si no hay usuario o no está autenticado o no ha cargado, devuelve información de invitado
    if (!user || !isSignedIn || !isLoaded) {
      return { name: "Cargando...", email: "...", avatar: "" };
    }

    const name =
      user.fullName ||
      user.firstName ||
      user.emailAddresses?.[0]?.emailAddress ||
      "Usuario";
    const email = user.emailAddresses?.[0]?.emailAddress || "N/A";
    const avatar = user.imageUrl || ""; // Clerk proporciona la URL del avatar

    return { name, email, avatar };
  };

  const displayUser = getUserDisplayInfo();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* ==================================================================== */}
        {/* Contenido cuando el usuario NO está autenticado */}
        <SignedOut>
          {/* SignInButton de Clerk abrirá el modal de inicio de sesión */}
          <SignInButton mode="modal">
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  <ScanFace className="size-4" />{" "}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Iniciar Sesión</span>
                <span className="truncate text-xs">Accede a tu cuenta</span>
              </div>
            </SidebarMenuButton>
          </SignInButton>
        </SignedOut>
        {/* ==================================================================== */}

        {/* ==================================================================== */}
        {/* Contenido cuando el usuario SÍ está autenticado */}
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={displayUser.avatar}
                    alt={displayUser.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {displayUser.name ? displayUser.name[0] : "CN"}{" "}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {displayUser.name}
                  </span>
                  <span className="truncate text-xs">{displayUser.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" // <-- Corregido el ancho para usar la variable CSS de Shadcn
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                    title="Cambiar Foto"
                      onClick={() => fileInputRef.current?.click()}
                      src={displayUser.avatar}
                      alt={displayUser.name}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*" // Solo acepta archivos de imagen
                      onChange={handleFileChange}
                    />
                    <AvatarFallback className="rounded-lg">
                      {displayUser.name ? displayUser.name[0] : "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {displayUser.name}
                    </span>
                    <span className="truncate text-xs">
                      {displayUser.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/create"
                    className="flex items-center gap-2"
                  >
                    <UserPlus2 className="size-4" /> {/* Añadido size */}
                    Nuevo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center gap-2">
                    <UserRoundCog className="size-4" /> {/* Añadido size */}
                    Administradores
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="https://dashboard.clerk.com/apps/app_2xKmXNdPcUlLshzC2yW6PRUoqB0/instances/ins_2xKmXOEalbGfkt7pvT39czPUA3M"
                    className="flex items-center gap-2"
                  >
                    <UserRoundCog className="size-4" /> {/* Añadido size */}
                    Clerk
                  </Link>
                </DropdownMenuItem>
                {/* Nueva opción para cambiar la foto de perfil */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* ==================================================================== */}
              {/* Funcionalidad de Cerrar Sesión */}
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="size-4" /> {/* Añadido size */}
                Cerrar Sesión
              </DropdownMenuItem>
              {/* ==================================================================== */}
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        {/* ==================================================================== */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
