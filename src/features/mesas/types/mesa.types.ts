import type { PageResponse } from "@/lib/types/api-response";

export type EstadoMesa = "LIBRE" | "OCUPADA" | "RESERVADA" | "INACTIVA";

export interface Mesa {
  id: number;
  numero: string;
  nombre: string | null;
  capacidad: number | null;
  qrToken: string;
  estado: EstadoMesa;
  activo: boolean;
  grupoId: string | null;
  mesasDelGrupo?: string[];
}

export interface CrearMesaRequest {
  numero: string;
  nombre?: string;
  capacidad?: number;
  qrToken?: string;
  estado?: EstadoMesa;
}

export interface ActualizarMesaRequest {
  numero?: string;
  nombre?: string;
  capacidad?: number;
  qrToken?: string;
  estado?: EstadoMesa;
}

export interface ListarMesasParams {
  estado?: EstadoMesa;
  activo?: boolean;
  page?: number;
  size?: number;
}

export type MesasPage = PageResponse<Mesa>;

export interface AgruparMesasRequest {
  mesaIds: number[];
}
