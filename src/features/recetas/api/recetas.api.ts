import type { Receta, RecetaRequest } from "@/features/recetas/types/receta.types";
import { apiClient } from "@/lib/api-client";

export async function listarRecetas(): Promise<Receta[]> {
  const response = await apiClient.get<Receta[]>("/recetas");
  if (!response.data) {
    throw new Error("Respuesta de listado sin datos");
  }
  return response.data;
}

export async function listarRecetasActivas(): Promise<Receta[]> {
  const response = await apiClient.get<Receta[]>("/recetas/activas");
  if (!response.data) {
    throw new Error("Respuesta de recetas activas sin datos");
  }
  return response.data;
}

export async function obtenerReceta(id: number): Promise<Receta> {
  const response = await apiClient.get<Receta>(`/recetas/${id}`);
  if (!response.data) {
    throw new Error("Respuesta de receta sin datos");
  }
  return response.data;
}

export async function crearReceta(body: RecetaRequest): Promise<Receta> {
  const response = await apiClient.post<Receta>("/recetas", body);
  if (!response.data) {
    throw new Error("Respuesta de creación sin datos");
  }
  return response.data;
}

export async function actualizarReceta(id: number, body: RecetaRequest): Promise<Receta> {
  const response = await apiClient.put<Receta>(`/recetas/${id}`, body);
  if (!response.data) {
    throw new Error("Respuesta de actualización sin datos");
  }
  return response.data;
}

export async function desactivarReceta(id: number): Promise<void> {
  await apiClient.delete(`/recetas/${id}`);
}
