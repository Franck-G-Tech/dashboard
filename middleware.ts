import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)'
  //,'/sign-up(.*)'
  
  // Agrega aquí otras rutas públicas si las tienes
]);

export default clerkMiddleware(async (auth, req) => {
  const authentication = await auth();

  // Si la ruta no es pública y el usuario no está autenticado, redirige.
  if (!isPublicRoute(req) && !authentication.userId) {
    console.log("Usuario no autenticado, redirigiendo...");
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};