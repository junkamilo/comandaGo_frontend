import type { CerrarCajaRequest, CierreCaja, PreviewCierre } from "@/features/caja/types/caja.types";
import { apiClient } from "@/lib/api-client";

export async function obtenerPreviewCierre(): Promise<PreviewCierre> {
  const response = await apiClient.get<PreviewCierre>("/caja/preview");
  if (!response.data) {
    throw new Error("Respuesta de preview de caja sin datos");
  }
  return response.data;
}

export async function cerrarCaja(body: CerrarCajaRequest): Promise<CierreCaja> {
  const response = await apiClient.post<CierreCaja>("/caja/cerrar", body);
  if (!response.data) {
    throw new Error("Respuesta de cierre de caja sin datos");
  }
  return response.data;
}

export async function listarCierres(): Promise<CierreCaja[]> {
  const response = await apiClient.get<CierreCaja[]>("/caja/cierres");
  return response.data ?? [];
}

export async function obtenerCierre(id: number): Promise<CierreCaja> {
  const response = await apiClient.get<CierreCaja>(`/caja/cierres/${id}`);
  if (!response.data) {
    throw new Error("Cierre de caja no encontrado");
  }
  return response.data;
}
