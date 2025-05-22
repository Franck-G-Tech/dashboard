import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from './_generated/dataModel';

export const obtenerSalones = query({
    args: {},
    handler: async (ctx) => {
      return await ctx.db.query("salones").collect();
    },
  });

export const crearSalon = mutation({
  args: {
    numero: v.string(),
    edificio: v.string(),
    planta: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("salones", args);
  },
});

export const actualizarSalon = mutation({
  args: {
    id: v.id("salones"),
    numero: v.string(),
    edificio: v.string(),
    planta: v.string(),
  },

  
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const eliminarSalon = mutation({
  args: { id: v.id("salones") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Obtener salon id
export const obtenerSalonPorId = query({ 
  args: { id: v.id("salones") },
  handler: async (ctx, args) => {
    const salon = await ctx.db.get(args.id as Id<'salones'>);
    return salon || null;
  },
});