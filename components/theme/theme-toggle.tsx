"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

/**
 * # Botón de Alternancia de Tema Claro/Oscuro
 *
 * ## Descripción:
 * Componente que permite al usuario alternar entre el tema claro y oscuro
 * con un solo clic en un botón.
 *
 * ## Características
 * - Botón único con icono dinámico (Sol/Luna)
 * - Alternancia directa entre temas claro y oscuro
 * - Animaciones suaves en los iconos
 * - Soporte completo de accesibilidad
 * - Manejo automático de hidratación
 * - Persistencia automática del tema usando next-themes
 *
 * ## Uso:
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle(): React.ReactElement | null {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-md border transition-colors hover:bg-accent"
      onClick={toggleTheme}
      aria-label="Alternar tema"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "-rotate-90 scale-0" : ""}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "scale-100" : "scale-0"}`} />
    </Button>
  );
}