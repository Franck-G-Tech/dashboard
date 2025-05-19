// app/convex.ts
import { api } from "../convex/_generated/api";
import { ConvexClient } from "convex/browser";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const fetchCalificaciones = async () => {
  try {
    const calificaciones = await convex.query(api.calificaciones.obtenerCalificaciones, {}); // Pasa un objeto vacío como argumento
    return calificaciones;
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    throw error; // Re-lanzar el error para que el componente lo maneje
  }
};
