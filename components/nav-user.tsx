// components/nav-user.tsx
"use client";

import {
  UserPlus2,
  ChevronsUpDown,
  UserRoundCog,
  LogOut,
  ScanFace,
  Link,
} from "lucide-react";

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
// ¡NUEVAS IMPORTACIONES DE CLERK!
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
  const { user, isSignedIn } = useUser(); // Obtiene el objeto de usuario y el estado de autenticación de Clerk
  const { signOut } = useClerk(); // Obtiene la función para cerrar sesión de Clerk

  // Función auxiliar para obtener la información del usuario de Clerk de forma segura
  const getUserDisplayInfo = () => {
    // Si no hay usuario o no está autenticado, devuelve información de invitado
    if (!user || !isSignedIn) {
      return { name: "Invitado", email: "N/A", avatar: "" };
    }

    // Clerk User object tiene diferentes propiedades, mapeamos a lo que el componente espera
    const name =
      user.fullName ||
      user.firstName ||
      user.emailAddresses?.[0]?.emailAddress ||
      "Usuario";
    const email = user.emailAddresses?.[0]?.emailAddress || "N/A";
    const avatar = user.imageUrl || ""; // Clerk proporciona la URL del avatar

    return { name, email, avatar };
  };

  const displayUser = getUserDisplayInfo(); // Prepara la información del usuario para mostrar

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
                  {/* Icono de "iniciar sesión" */}
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
                    {/* Primera letra del nombre */}
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
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={displayUser.avatar}
                      alt={displayUser.name}
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
              {/* <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator /> */}
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/admin/create" className="flex items-center gap-2">
                    <UserPlus2 />
                    Nuevo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserRoundCog />
                  <Link href="/admin" className="flex items-center gap-2">
                    Administradores
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Bell />
                  Notificaciones
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* ==================================================================== */}
              {/* Funcionalidad de Cerrar Sesión */}
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut />
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
