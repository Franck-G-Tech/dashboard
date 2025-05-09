import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from './_generated/dataModel';

export const obtenerMaterias = query({
    args: {},
    handler: async (ctx) => {
      return await ctx.db.query("materias").collect();
    },
  });

export const crearMateria = mutation({
  args: {
    identificador: v.string(),
    nombre: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("materias", args);
  },
});

export const actualizarMateria = mutation({
  args: {
    id: v.id("materias"),
    identificador: v.string(),
    nombre: v.string(),
  },

  
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const eliminarMateria = mutation({
  args: { id: v.id("materias") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Obtener materia id
export const obtenerMateriaPorId = query({ 
  args: { id: v.id("materias") },
  handler: async (ctx, args) => {
    const estudiante = await ctx.db.get(args.id as Id<'materias'>);
    return estudiante || null;
  },
});