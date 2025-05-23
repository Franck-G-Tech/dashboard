/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as calificaciones from "../calificaciones.js";
import type * as estudiantes from "../estudiantes.js";
import type * as horarios from "../horarios.js";
import type * as internal_users from "../internal_users.js";
import type * as maestros from "../maestros.js";
import type * as materias from "../materias.js";
import type * as mutations_agregarCalificacion from "../mutations/agregarCalificacion.js";
import type * as salones from "../salones.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  calificaciones: typeof calificaciones;
  estudiantes: typeof estudiantes;
  horarios: typeof horarios;
  internal_users: typeof internal_users;
  maestros: typeof maestros;
  materias: typeof materias;
  "mutations/agregarCalificacion": typeof mutations_agregarCalificacion;
  salones: typeof salones;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
