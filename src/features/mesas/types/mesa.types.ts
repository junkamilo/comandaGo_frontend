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
}

export interface ListarMesasParams {
  estado?: EstadoMesa;
  activo?: boolean;
  page?: number;
  size?: number;
}

export type MesasPage = PageResponse<Mesa>;
