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
const resend = new Resend(process.env.RESEND_API!);
const emailResend = "School-App <noreply@franck.korian-labs.net>";

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
  },
  
   //const resetUrl = "/https://dashboard-flax-xi.vercel.app";

   
  
    

  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; clerkId?: string; convexId?: Id<"users"> }> => {
    let clerkUser = null; // Necesitamos esto para la compensación en caso de fallo
    let invitationSent = false; // Bandera para saber si la invitación de Clerk fue enviada


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

     // --- PASO 2: Crear una Invitación en Clerk (esto crea el usuario si no existe) ---
      // La invitación le permitirá al usuario establecer su propia contraseña
      const invitation = await clerk.invitations.createInvitation({
        emailAddress: args.email,
        publicMetadata: {
          name: args.name,
        },
        redirectUrl: "https://franck.korian-labs.net", // Ejemplo
      });
      invitationSent = true;
       console.log("Invitación de Clerk enviada:", invitation);
     
       let attempts = 0;
      const maxAttempts = 5;
      const delay = 1000; // 1 segundo

      while (attempts < maxAttempts) {
        const users = await clerk.users.getUserList({ emailAddress: [args.email] });
        if (users.data.length > 0) {
          clerkUser = users.data[0];
          break;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        attempts++;
      }

      if (!clerkUser) {
        throw new Error("Fallo al encontrar el usuario recién creado en Clerk después de la invitación.");
      }


      // --- PASO 3: Registrar el usuario en Convex (llama a la mutación interna) ---
      const convexUserId = await ctx.runMutation(
        internal.internal_users.insertUser,
        {
          clerkId: clerkUser.id,
          name: args.name,
          email: args.email,
          status: "active",
          createdAt: Date.now(),
        }
      );

       console.log(
        `Usuario creado exitosamente. Clerk ID: ${clerkUser.id}, Convex ID: ${convexUserId}, email: ${args.email} `
      );

       await resend.emails.send({
        from: emailResend,
        to: args.email,
        subject: "¡Bienvenido a School-App!",
        html: `
       <!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>¡Bienvenido/a a School-App!</title>
<style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 30px auto;
    background-color: #ffffff;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .header {
    padding-bottom: 20px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 20px;
  }
  .header h1 {
    color: #333333;
    font-size: 28px;
    margin: 0;
  }
  .content {
    text-align: left; /* Alinea el texto del contenido a la izquierda */
    margin-bottom: 20px;
  }
  .content p {
    margin-bottom: 15px;
  }
  .button-wrapper {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .button {
    display: inline-block;
    background-color: #4CAF50; /* Un verde vibrante, puedes cambiarlo al color de tu marca */
    color: #ffffff !important;
    padding: 12px 30px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
  }
  .button:hover {
    background-color: #45a049; /* Un tono más oscuro al pasar el mouse */
  }
  .footer {
    padding-top: 20px;
    border-top: 1px solid #eeeeee;
    font-size: 12px;
    color: #777777;
    text-align: center;
  }
  .footer a {
    color: #007bff;
    text-decoration: none;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido/a a School-App!</h1>
    </div>

    <div class="content">
      <p>Hola, <strong>${args.name}</strong>,</p>
      <p>¡Nos emociona darte la bienvenida a <strong>School-App</strong>, la plataforma que simplificará tu experiencia educativa!</p>
      <p>Aquí podrás:</p>
      <ul>
        <li>Acceder a la informacion al instante.</li>
        <li>Maestros.</li>
        <li>Estudiantes.</li>
        <li>Calificaciones.</li>
        <li>Y mucho más...</li>
      </ul>
      <p>Estamos aquí para ayudarte a sacar el máximo provecho de tu tiempo en la escuela. ¡Prepárate para una experiencia educativa más organizada y conectada!</p>
    </div>
 
    <div class="button-wrapper">
      <a href="https://franck.korian-labs.net" class="button">¡Empezar ahora!</a>
    </div>

    <div class="footer">
      <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en <a href="mailto:soporte@franck.korian-labs.net">contactar a nuestro equipo de soporte</a>.</p>
      <p>&copy; 2025 School-App. Todos los derechos reservados.</p>
      </div>
  </div>
</body>
</html>
      `,
      });

      return {
        success: true,
        
        clerkId: clerkUser.id,
        convexId: convexUserId,
      };
      
    } catch (error) {
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
        } catch (clerkDeleteError) {
          console.error(
            `¡FALLO CRÍTICO DE CONSISTENCIA! No se pudo eliminar el usuario de Clerk (${clerkUser.id}) después de un fallo en Convex.`,
            clerkDeleteError
          );
        }
      }

      // Re-lanzar el error como un Error estándar de JS
      if (typeof error === "object" && error !== null && "message" in error) {
        throw new Error("Error");
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
    } catch (clerkError) {
      console.error("Error al actualizar el email en Clerk:", clerkError);
      throw new Error(
        `Fallo al actualizar el email en Clerk: ${
          
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
        
      } catch (clerkError) {
        console.error(
          `[ACTION ERROR] Fallo al eliminar usuario de Clerk ${userToDelete.clerkId}:`,
          clerkError
        );
        throw new Error(
          `Fallo al eliminar usuario de Clerk: ${
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
