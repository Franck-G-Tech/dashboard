// convex/users.ts
import { v } from "convex/values";
import { action } from "./_generated/server";
import { createClerkClient } from "@clerk/backend";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { query, mutation, internalMutation } from "./_generated/server";
import { Resend } from "resend";

// ====================================================================
// 1. Inicialización de Clientes Externos (Clerk)
// ====================================================================
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const resend = new Resend(process.env.RESEND_API_KEY!);

// ====================================================================
// 2. Actions (Funciones que modifican el estado de la DB o tienen efectos secundarios)
// ====================================================================

/**
 * Crea un nuevo usuario tanto en Clerk (sistema de autenticación) como en Convex (base de datos).
 * Maneja duplicados de correo electrónico y errores en ambos sistemas para mantener la consistencia.
 * NOTA: Esta versión utiliza Errores estándar de JS.
 *
 * @param args.name - Nombre completo del usuario.
 * @param args.email - Correo electrónico único del usuario.
 * @param args.password - Contraseña del usuario.
 * @returns Un objeto con el ID de Convex (`convexId`) y el ID de Clerk (`clerkId`) del usuario creado.
 */
export const createUser = action({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  
   //const resetUrl = "/https://dashboard-flax-xi.vercel.app";

   
  
    

  handler: async (
    ctx,
    args
  ): Promise<{ clerkId: string; convexId: Id<"users"> }> => {
    let clerkUser = null;

    try {
      // --- PASO 1: Validación de Unicidad (Pre-creación) ---
      // 1.1: Verificar si el email ya existe en Clerk
      const clerkUsersWithEmail = await clerk.users.getUserList({
        emailAddress: [args.email],
      });
      if (clerkUsersWithEmail.data.length > 0) {
        // Lanzamos un Error estándar
        throw new Error("Este correo electrónico ya está registrado.");
      }

      // 1.2: Verificar si el email ya existe en Convex (llama a la query interna)
      const convexUserWithEmail = await ctx.runQuery(
        internal.internal_users.getByEmail,
        { email: args.email }
      );
      if (convexUserWithEmail) {
        // Lanzamos un Error estándar
        throw new Error(
          "Este correo electrónico ya está registrado en nuestra base de datos."
        );
      }

      // --- PASO 2: Crear el usuario en Clerk ---
      clerkUser = await clerk.users.createUser({
        firstName: args.name.split(" ")[0],
        lastName: args.name.split(" ").slice(1).join(" ") || "",
        emailAddress: [args.email],
        password: args.password,
      });

      // --- PASO 3: Registrar el usuario en Convex (llama a la mutación interna) ---
      const convexUserId = await ctx.runMutation(
        internal.internal_users.insertUser,
        {
          clerkId: clerkUser.id,
          name: args.name,
          email: args.email,
          status: "active", // Valor literal que coincide con el v.union de tu esquema
          createdAt: Date.now(),
        }
      );

      console.log(
        `Usuario creado exitosamente. Clerk ID: ${clerkUser.id}, Convex ID: ${convexUserId}, email: ${args.email} `
      );
       await resend.emails.send({
        from: "onboarding@resend.dev",
        to: args.email,
        subject: "¡Bienvenido a School-App!",
        html: `
        <h1>Bienvenido a nuestra plataforma</h1>
        
        <a href="https://dashboard-flax-xi.vercel.app">Empezar</a>
        
      `,
      });

      return { clerkId: clerkUser.id, convexId: convexUserId,  };
      
    } catch (error: any) {
      // --- PASO 4: Manejo de Errores y Compensación ---
      console.error("Error en la acción createUser:", error);

      // Si el usuario fue creado en Clerk pero falló la inserción en Convex, intentar deshacer.
      if (clerkUser && clerkUser.id) {
        console.warn(
          `Intentando eliminar usuario de Clerk (${clerkUser.id}) debido a un fallo en la inserción de Convex.`
        );
        try {
          await clerk.users.deleteUser(clerkUser.id);
          console.log(
            `Usuario de Clerk (${clerkUser.id}) eliminado exitosamente como compensación.`
          );
        } catch (clerkDeleteError: any) {
          console.error(
            `¡FALLO CRÍTICO DE CONSISTENCIA! No se pudo eliminar el usuario de Clerk (${clerkUser.id}) después de un fallo en Convex.`,
            clerkDeleteError
          );
        }
      }

      // Re-lanzar el error como un Error estándar de JS
      if (typeof error === "object" && error !== null && "message" in error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "Fallo al crear el usuario. Por favor, inténtalo de nuevo o contacta a soporte. Detalles: Error desconocido."
        );
      }
    }
  },
});

export const obtenerUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

//Obtener usuario por id
export const getUserById = query({
  args: { id: v.id("users") }, // Expects an Id<"users"> type as an argument
  handler: async (ctx, args) => {
    return (await ctx.db.get(args.id as Id<"users">)) || null; // Fetches a document by its ID
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"), // The ID of the user to update
    name: v.optional(v.string()), // Optional: Can update name
    email: v.optional(v.string()), // Optional: Can update email
    status: v.optional(
      v.union(v.literal("active"), v.literal("blocked"), v.literal("deleted"))
    ), // Optional: Can update status
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const updateEmailInConvex = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      await ctx.db.patch(user._id, { email: args.email });
      console.log(
        `Internal: Updated email for user ${user._id} to ${args.email}`
      );
    } else {
      console.warn(
        `Internal: User with clerkId ${args.clerkId} not found in Convex for email update.`
      );
    }
  },
});

export const updateUserInClerkAndConvex = action({
  args: {
    userId: v.id("users"), // El ID de Convex del usuario
    clerkId: v.string(), // El ID de Clerk del usuario
    newEmail: v.string(), // La nueva dirección de correo electrónico
  },
  handler: async (ctx, args) => {
    let emailAddressIdToSetAsPrimary: string | undefined;

    try {
      // 1. Obtener la información actual del usuario desde Clerk
      const clerkUser = await clerk.users.getUser(args.clerkId);
      const currentPrimaryEmailAddress = clerkUser.emailAddresses.find(
        (ea) => ea.id === clerkUser.primaryEmailAddressId
      );

      // Si el nuevo email es el mismo que el actual primario, no hay que hacer nada en Clerk para el email.
      if (currentPrimaryEmailAddress?.emailAddress === args.newEmail) {
        emailAddressIdToSetAsPrimary = currentPrimaryEmailAddress.id;
        console.log(
          `El email ya es el primario en Clerk para el usuario ${args.clerkId}.`
        );
      } else {
        // Buscar si la nueva dirección de email ya existe entre las direcciones secundarias del usuario
        const existingEmailAddress = clerkUser.emailAddresses.find(
          (ea) => ea.emailAddress === args.newEmail
        );

        if (existingEmailAddress) {
          // Si el email ya existe (como secundario), simplemente lo hacemos primario
          emailAddressIdToSetAsPrimary = existingEmailAddress.id;
          console.log(
            `El email ${args.newEmail} ya existe, se establecerá como primario para ${args.clerkId}.`
          );
        } else {
          // Si el email es completamente nuevo, primero hay que crearlo y asociarlo al usuario
          console.log(
            `El email ${args.newEmail} es nuevo, creándolo en Clerk para ${args.clerkId}.`
          );

          // 3. Crear nueva dirección de correo
          const newClerkEmailAddress =
            await clerk.emailAddresses.createEmailAddress({
              userId: args.clerkId,
              emailAddress: args.newEmail,
            });
          // 4. Marcar como verificada y primaria
          await clerk.emailAddresses.updateEmailAddress(
            newClerkEmailAddress.id,
            {
              verified: true,
              primary: true,
            }
          );

          // 6. Eliminar correo anterior si existe
          if (currentPrimaryEmailAddress) {
            await clerk.emailAddresses.deleteEmailAddress(
              currentPrimaryEmailAddress.id
            );
          }
        }
      }
    } catch (clerkError: any) {
      console.error("Error al actualizar el email en Clerk:", clerkError);
      throw new Error(
        `Fallo al actualizar el email en Clerk: ${
          clerkError.errors?.[0]?.message ||
          clerkError.message ||
          String(clerkError)
        }`
      );
    }

    // 2. Disparar la mutación interna para actualizar el email en Convex
    // Esto se hace siempre al final si la parte de Clerk fue exitosa,
    // o si el email no cambió en Clerk pero sí en Convex.
    await ctx.runMutation(internal.users.updateEmailInConvex, {
      clerkId: args.clerkId,
      email: args.newEmail, // El email que se intentó establecer como primario en Clerk
    });
    console.log(
      `Usuario en Convex con clerkId ${args.clerkId} email actualizado a ${args.newEmail}`
    );
  },
});

//Eliminar usuario de Clerk y Convex
export const deleteUser = action({
  args: {
    userId: v.id("users"), // El ID del usuario en tu tabla de Convex
  },
  handler: async (ctx, args) => {
    console.log(
      `[ACTION] Iniciando eliminación para usuario Convex ID: ${args.userId}`
    );

    // 1. Obtener los datos del usuario de Convex para obtener el clerkId
    // Llama a la nueva función interna de internal_users.ts
    const userToDelete = await ctx.runQuery(
      internal.internal_users.getUserByIdInternal,
      {
        // <-- ¡NUEVA LLAMADA!
        id: args.userId,
      }
    );

    if (!userToDelete) {
      console.warn(
        `[ACTION] Usuario con Convex ID ${args.userId} no encontrado para eliminación.`
      );
      throw new Error("Usuario no encontrado.");
    }

    // 2. Eliminar el usuario de Clerk (si tiene un clerkId)
    if (userToDelete.clerkId) {
      console.log(
        `[ACTION] Intentando eliminar usuario de Clerk con ID: ${userToDelete.clerkId}`
      );
      try {
        await clerk.users.deleteUser(userToDelete.clerkId);
        console.log(
          `[ACTION] Usuario de Clerk ${userToDelete.clerkId} eliminado exitosamente.`
        );
        
      } catch (clerkError: any) {
        console.error(
          `[ACTION ERROR] Fallo al eliminar usuario de Clerk ${userToDelete.clerkId}:`,
          clerkError
        );
        throw new Error(
          `Fallo al eliminar usuario de Clerk: ${
            clerkError.errors?.[0]?.message ||
            clerkError.message ||
            String(clerkError)
          }`
        );
      }
    } else {
      console.log(
        `[ACTION] Usuario Convex ID ${args.userId} no tiene Clerk ID. Solo eliminando de Convex.`
      );
    }

    // 3. Eliminar el usuario de Convex
    // Llama a la nueva función interna de internal_users.ts
    await ctx.runMutation(internal.internal_users.deleteUserInternal, {
      // <-- ¡NUEVA LLAMADA!
      id: args.userId,
      
    });
    console.log(
      `[ACTION] Usuario Convex ID ${args.userId} eliminado de Convex exitosamente.`
    );

    return { success: true };
  },
});
