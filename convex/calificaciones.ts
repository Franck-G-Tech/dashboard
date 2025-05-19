// convex/queries/obtenerCalificaciones.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// Consulta para obtener todas las calificaciones
export const obtenerCalificaciones = query({
  handler: async (ctx) => {
    // Obtenemos todas las calificaciones
    const calificaciones = await ctx.db.query("calificaciones").collect();
    
    // Para cada calificación, obtenemos los datos relacionados
    const calificacionesConDetalles = await Promise.all(
      calificaciones.map(async (calificacion) => {
        const estudiante = await ctx.db.get(calificacion.alumnoId);
        const materia = await ctx.db.get(calificacion.materiaId);
        
        return {
          ...calificacion,
          estudiante: estudiante ? {
            id: estudiante._id,
            nombre: estudiante.nombre,
            numeroMatricula: estudiante.numeroMatricula
          } : null,
          materia: materia ? {
            id: materia._id,
            nombreMateria: materia.nombre,
            identificador: materia.identificador
          } : null
        };
      })
    );

    return calificacionesConDetalles;
  },
});



export const obtenerCalificacionesPorMateria = query({
  args: { materiaId: v.id("materias") },
  handler: async (ctx, args) => {
    const calificaciones = await ctx.db
      .query("calificaciones")
      .filter((q) => q.eq(q.field("materiaId"), args.materiaId))
      .collect();

    const calificacionesConDetalles = await Promise.all(
      calificaciones.map(async (calificacion) => {
        const estudiante = await ctx.db.get(calificacion.alumnoId);
        const materia = await ctx.db.get(calificacion.materiaId);  // Obtener la materia, aunque ya la filtramos.

        return {
          ...calificacion,
          alumno: estudiante
            ? {
                id: estudiante._id,
                nombre: estudiante.nombre,
                numMatricula: estudiante.numeroMatricula,
              }
            : { id: "N/A", nombre: "N/A", numMatricula: "N/A" },
          materia: materia
            ? {
                id: materia._id,
                nombreMateria: materia.nombre, // Asegúrate de que esto coincida
                identificador: materia.identificador,
              }
            : { id: "N/A", nombreMateria: "N/A", identificador: "N/A" },
        };
      })
    );
    return calificacionesConDetalles;
  },
});


export const obtenerCalificacionesPorAlumnoYMateria = query({
  args: {
    alumnoId: v.id("estudiantes"),
    materiaId: v.id("materias"),
  },
  handler: async ({ db }, args): Promise<any[]> => {
    return await db
      .query("calificaciones")
      .filter((q) =>
        q.and(
          q.eq(q.field("alumnoId"), args.alumnoId),
          q.eq(q.field("materiaId"), args.materiaId)
        )
      )
      .collect();
  },
});

export const obtenerCalificacionesConInfo = query(
  async ({ db }): Promise<
    any[] // Cambiamos el tipo de retorno a any[] por ahora
  > => {
    const calificaciones = await db.query("calificaciones").collect();

    return Promise.all(
      calificaciones.map(async (calificacion: any) => {
        const estudiante = await db.get(calificacion.alumnoId);
        const materia = await db.get(calificacion.materiaId);
        return {
          ...calificacion,
          estudiante: estudiante,
          materia: materia,
        };
      })
    );
  }
);