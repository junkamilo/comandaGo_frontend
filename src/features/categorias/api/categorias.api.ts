import type {
  ActualizarCategoriaRequest,
  Categoria,
  CrearCategoriaRequest,
} from "@/features/categorias/types/categoria.types";
import { apiClient } from "@/lib/api-client";

export async function listarTodasCategorias(): Promise<Categoria[]> {
  const response = await apiClient.get<Categoria[]>("/categorias/todas");
  if (!response.data) {
    throw new Error("Respuesta de listado sin datos");
  }
  return response.data;
}

export async function crearCategoria(body: CrearCategoriaRequest): Promise<Categoria> {
  const response = await apiClient.post<Categoria>("/categorias", body);
  if (!response.data) {
    throw new Error("Respuesta de creación sin datos");
  }
  return response.data;
}

export async function actualizarCategoria(
  id: number,
  body: ActualizarCategoriaRequest,
): Promise<Categoria> {
  const response = await apiClient.put<Categoria>(`/categorias/${id}`, body);
  if (!response.data) {
    throw new Error("Respuesta de actualización sin datos");
  }
  return response.data;
}

export async function eliminarCategoria(id: number): Promise<void> {
  await apiClient.delete(`/categorias/${id}`);
}

export async function actualizarActivoCategoria(id: number, activo: boolean): Promise<Categoria> {
  const response = await apiClient.patch<Categoria>(`/categorias/${id}/activo`, { activo });
  if (!response.data) {
    throw new Error("Respuesta de activo sin datos");
  }
  return response.data;
}
