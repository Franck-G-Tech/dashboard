// convex/mutations/agregarCalificacion.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const agregarCalificacion = mutation({
  args: {
    alumnoId: v.id("estudiantes"), // Recibimos el ID del estudiante
    materiaId: v.id("materias"),   // Recibimos el ID de la materia
    nota: v.number(),
    semestre: v.string(),
  },
  handler: async ({ db }, args) => {
    const newCalificacion = {
      alumnoId: args.alumnoId,
      materiaId: args.materiaId,
      nota: args.nota,
      semestre: args.semestre,
    };

    const calificacionId = await db.insert("calificaciones", newCalificacion);
    return calificacionId;
  },
});