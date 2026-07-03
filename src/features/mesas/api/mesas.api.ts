import type {
  ActualizarMesaRequest,
  AgruparMesasRequest,
  CrearMesaRequest,
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

export async function listarMesasPiso(): Promise<Mesa[]> {
  const response = await apiClient.get<Mesa[]>("/mesas/piso");
  if (!response.data) {
    throw new Error("Respuesta de piso sin datos");
  }
  return response.data;
}

export async function listarMesasLibres(): Promise<Mesa[]> {
  const response = await apiClient.get<Mesa[]>("/mesas/libres");
  if (!response.data) {
    throw new Error("Respuesta de libres sin datos");
  }
  return response.data;
}

export async function obtenerMesa(id: number): Promise<Mesa> {
  const response = await apiClient.get<Mesa>(`/mesas/${id}`);
  if (!response.data) {
    throw new Error("Respuesta de mesa sin datos");
  }
  return response.data;
}

export async function crearMesa(body: CrearMesaRequest): Promise<Mesa> {
  const response = await apiClient.post<Mesa>("/mesas", body);
  if (!response.data) {
    throw new Error("Respuesta de creación sin datos");
  }
  return response.data;
}

export async function actualizarMesa(id: number, body: ActualizarMesaRequest): Promise<Mesa> {
  const response = await apiClient.put<Mesa>(`/mesas/${id}`, body);
  if (!response.data) {
    throw new Error("Respuesta de actualización sin datos");
  }
  return response.data;
}

export async function eliminarMesa(id: number): Promise<void> {
  await apiClient.delete(`/mesas/${id}`);
}

export async function actualizarEstadoMesa(id: number, estado: EstadoMesa): Promise<Mesa> {
  const response = await apiClient.patch<Mesa>(`/mesas/${id}/estado`, { estado });
  if (!response.data) {
    throw new Error("Respuesta de estado sin datos");
  }
  return response.data;
}

export async function agruparMesas(body: AgruparMesasRequest): Promise<Mesa[]> {
  const response = await apiClient.post<Mesa[]>("/mesas/agrupar", body);
  if (!response.data) {
    throw new Error("Respuesta de agrupación sin datos");
  }
  return response.data;
}

export async function desagruparMesas(grupoId: string): Promise<void> {
  await apiClient.delete(`/mesas/grupo/${grupoId}`);
}
