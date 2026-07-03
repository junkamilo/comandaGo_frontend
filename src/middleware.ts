import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { Rol } from "@/features/auth/types/auth.types";
import { rutaInicialPorRol, rutaPermitida } from "@/features/navigation/modulos-data";

const TOKEN_COOKIE = "cg_access_token";
const ROL_COOKIE = "cg_rol";

const PROTECTED_PREFIXES = [
  "/",
  "/pedidos",
  "/cocina",
  "/mesas",
  "/recepcion",
  "/carta",
  "/ventas",
  "/caja",
  "/personal",
  "/configuracion",
];

function isProtectedRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return PROTECTED_PREFIXES.some((p) => p !== "/" && pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const rol = request.cookies.get(ROL_COOKIE)?.value as Rol | undefined;
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    if (token && rol) {
      return NextResponse.redirect(new URL(rutaInicialPorRol(rol), request.url));
    }
    return NextResponse.next();
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  if (!token || !rol) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!rutaPermitida(rol, pathname)) {
    return NextResponse.redirect(new URL(rutaInicialPorRol(rol), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/pedidos/:path*",
    "/cocina/:path*",
    "/mesas/:path*",
    "/recepcion/:path*",
    "/carta/:path*",
    "/ventas/:path*",
    "/caja/:path*",
    "/personal/:path*",
    "/configuracion/:path*",
  ],
};
