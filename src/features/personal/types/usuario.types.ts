import type { Rol } from "@/features/auth/types/auth.types";
import type { PageResponse } from "@/lib/types/api-response";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  rol: Rol;
  activo: boolean;
  ultimoAcceso: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CrearUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  rol: Rol;
}

export interface ActualizarUsuarioRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
  rol?: Rol;
}

export interface ListarUsuariosParams {
  rol?: Rol;
  activo?: boolean;
  page?: number;
  size?: number;
}

export type UsuariosPage = PageResponse<Usuario>;
