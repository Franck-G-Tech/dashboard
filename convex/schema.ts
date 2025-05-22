import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  estudiantes: defineTable({
    numeroMatricula: v.string(),
    nombre: v.string(),
    correo: v.string(),
  }),
  maestros: defineTable({
    numeroEmpleado: v.string(),
    nombre: v.string(),
    correo: v.string(),
  }),
  materias: defineTable({
    identificador: v.string(),
    nombre: v.string(),
  }),
  horarios: defineTable({
    periodo: v.string(), //modulo o periodo
  }),
  salones: defineTable({
    numero: v.string(),
    edificio: v.string(),
    planta: v.string(),
  }),
  calificaciones: defineTable({
    alumnoId: v.id("estudiantes"), // Referencia al estudiante
    materiaId: v.id("materias"), // Referencia a la materia
    nota: v.number(),
    semestre: v.string(),
  }),
  users: defineTable({
    clerkId: v.string(), // El ID único de Clerk
    name: v.string(), // Nombre que Clerk te da
    email: v.string(), // Correo electrónico principal de Clerk
    status: v.union(
      v.literal("active"),
      v.literal("blocked"),
      v.literal("deleted")
    ),
    role: v.optional(v.string()), // Ejemplo: 'estudiante', 'maestro', 'admin'
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),
});
