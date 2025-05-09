import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from './_generated/dataModel';

export const obtenerMaestros = query({
    args: {},
    handler: async (ctx) => {
      return await ctx.db.query("maestros").collect();
    },
  });

export const crearMaestro = mutation({
  args: {
    numeroEmpleado: v.string(),
    nombre: v.string(),
    correo: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("maestros", args);
  },
});

export const actualizarMaestro = mutation({
  args: {
    id: v.id("maestros"),
    numeroEmpleado: v.string(),
    nombre: v.string(),
    correo: v.string(),
  },

  
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const eliminarMaestro = mutation({
  args: { id: v.id("maestros") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Obtener maestro id
export const obtenerMaestroPorId = query({ 
  args: { id: v.id("maestros") },
  handler: async (ctx, args) => {
    const estudiante = await ctx.db.get(args.id as Id<'maestros'>);
    return estudiante || null;
  },
});