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
    periodo: v.string(),//modulo o periodo
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
  })
});