import type {
  EstadoMesa,
  ListarMesasParams,
  Mesa,
  MesasPage,
} from "@/features/mesas/types/mesa.types";
import { apiClient } from "@/lib/api-client";

function buildQuery(params: ListarMesasParams): string {
  const search = new URLSearchParams();
  if (params.estado) search.set("estado", params.estado);
  if (params.activo !== undefined) search.set("activo", String(params.activo));
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 50));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listarMesas(params: ListarMesasParams = {}): Promise<MesasPage> {
  const response = await apiClient.get<MesasPage>(`/mesas${buildQuery(params)}`);
  if (!response.data) {
    throw new Error("Respuesta de listado sin datos");
  }
  return response.data;
}

export async function actualizarEstadoMesa(id: number, estado: EstadoMesa): Promise<Mesa> {
  const response = await apiClient.patch<Mesa>(`/mesas/${id}/estado`, { estado });
  if (!response.data) {
    throw new Error("Respuesta de estado sin datos");
  }
  return response.data;
}
