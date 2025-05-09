import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from './_generated/dataModel';

export const obtenerHorarios = query({
    args: {},
    handler: async (ctx) => {
      return await ctx.db.query("horarios").collect();
    },
  });

export const crearHorario = mutation({
  args: {
    periodo: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("horarios", args);
  },
});

export const actualizarHorario = mutation({
  args: {
    id: v.id("horarios"),
    periodo: v.string(),
  },

  
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const eliminarHorario = mutation({
  args: { id: v.id("horarios") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Obtener horario id
export const obtenerHorarioPorId = query({ 
  args: { id: v.id("horarios") },
  handler: async (ctx, args) => {
    const estudiante = await ctx.db.get(args.id as Id<'horarios'>);
    return estudiante || null;
  },
});