// convex/internal_users.ts
import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Consulta interna para verificar si un usuario ya existe por correo electrónico.
 * Usado por 'actions' que necesitan leer la DB.
 */
export const getByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

/**
 * Mutación interna para insertar un nuevo usuario en la base de datos.
 * Usado por 'actions' que necesitan escribir en la DB.
 */
export const insertUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    // === ¡ESTE ES EL CAMBIO CLAVE! ===
    status: v.union(
      v.literal("active"),
      v.literal("blocked"),
      v.literal("deleted")
    ),
    // =================================
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});

export const getUserByIdInternal = internalQuery({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const deleteUserInternal = internalMutation({
  // <-- Esta es la otra
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
