import type {
  ActualizarProductoRequest,
  CrearProductoRequest,
  ListarProductosParams,
  Producto,
  ProductosPage,
} from "@/features/productos/types/producto.types";
import type { PersonalizacionProducto } from "@/features/pos/types/personalizacion.types";
import { apiClient } from "@/lib/api-client";

function buildQuery(params: ListarProductosParams): string {
  const search = new URLSearchParams();
  if (params.categoriaId !== undefined) search.set("categoriaId", String(params.categoriaId));
  if (params.activo !== undefined) search.set("activo", String(params.activo));
  if (params.disponible !== undefined) search.set("disponible", String(params.disponible));
  if (params.esPromocion !== undefined) search.set("esPromocion", String(params.esPromocion));
  if (params.tipo !== undefined) search.set("tipo", params.tipo);
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 100));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listarProductos(params: ListarProductosParams = {}): Promise<ProductosPage> {
  const response = await apiClient.get<ProductosPage>(`/productos${buildQuery(params)}`);
  if (!response.data) {
    throw new Error("Respuesta de listado sin datos");
  }
  return response.data;
}

export async function obtenerProducto(id: number): Promise<Producto> {
  const response = await apiClient.get<Producto>(`/productos/${id}`);
  if (!response.data) {
    throw new Error("Respuesta de producto sin datos");
  }
  return response.data;
}

export async function obtenerPersonalizacionProducto(
  id: number,
): Promise<PersonalizacionProducto> {
  const response = await apiClient.get<PersonalizacionProducto>(
    `/productos/${id}/personalizacion`,
  );
  if (!response.data) {
    throw new Error("Respuesta de personalización sin datos");
  }
  return response.data;
}

export async function listarInsumos(): Promise<Producto[]> {
  const response = await apiClient.get<Producto[]>("/productos/insumos");
  if (!response.data) {
    throw new Error("Respuesta de insumos sin datos");
  }
  return response.data;
}

export async function crearProducto(body: CrearProductoRequest): Promise<Producto> {
  const response = await apiClient.post<Producto>("/productos", body);
  if (!response.data) {
    throw new Error("Respuesta de creación sin datos");
  }
  return response.data;
}

export async function actualizarProducto(
  id: number,
  body: ActualizarProductoRequest,
): Promise<Producto> {
  const response = await apiClient.put<Producto>(`/productos/${id}`, body);
  if (!response.data) {
    throw new Error("Respuesta de actualización sin datos");
  }
  return response.data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await apiClient.delete(`/productos/${id}`);
}

export async function obtenerMenuDelDia(): Promise<Producto[]> {
  const response = await apiClient.get<Producto[]>("/productos/menu-del-dia");
  if (!response.data) {
    throw new Error("Respuesta de menú del día sin datos");
  }
  return response.data;
}

export async function actualizarDisponibilidadProducto(
  id: number,
  disponible: boolean,
): Promise<Producto> {
  const response = await apiClient.patch<Producto>(`/productos/${id}/disponibilidad`, {
    disponible,
  });
  if (!response.data) {
    throw new Error("Respuesta de disponibilidad sin datos");
  }
  return response.data;
}

export async function reordenarProductos(body: {
  ids: number[];
  categoriaId: number;
}): Promise<void> {
  await apiClient.put("/productos/reordenar", body);
}
