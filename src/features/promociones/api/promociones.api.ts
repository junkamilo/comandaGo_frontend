import type { Promocion, PromocionRequest } from "@/features/promociones/types/promocion.types";
import { apiClient } from "@/lib/api-client";

export async function listarPromociones(): Promise<Promocion[]> {
  const response = await apiClient.get<Promocion[]>("/promociones");
  if (!response.data) {
    throw new Error("Respuesta de listado sin datos");
  }
  return response.data;
}

export async function obtenerPromocion(id: number): Promise<Promocion> {
  const response = await apiClient.get<Promocion>(`/promociones/${id}`);
  if (!response.data) {
    throw new Error("Respuesta de promoción sin datos");
  }
  return response.data;
}

export async function crearPromocion(body: PromocionRequest): Promise<Promocion> {
  const response = await apiClient.post<Promocion>("/promociones", body);
  if (!response.data) {
    throw new Error("Respuesta de creación sin datos");
  }
  return response.data;
}

export async function actualizarPromocion(id: number, body: PromocionRequest): Promise<Promocion> {
  const response = await apiClient.put<Promocion>(`/promociones/${id}`, body);
  if (!response.data) {
    throw new Error("Respuesta de actualización sin datos");
  }
  return response.data;
}

export async function desactivarPromocion(id: number): Promise<void> {
  await apiClient.delete(`/promociones/${id}`);
}
