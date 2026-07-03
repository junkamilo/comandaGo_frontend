import { apiClient } from "@/lib/api-client";
import type {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  ListarUsuariosParams,
  Usuario,
  UsuariosPage,
} from "@/features/personal/types/usuario.types";

function buildQuery(params: ListarUsuariosParams): string {
  const search = new URLSearchParams();
  if (params.rol) search.set("rol", params.rol);
  if (params.activo !== undefined) search.set("activo", String(params.activo));
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 50));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listarUsuarios(params: ListarUsuariosParams = {}): Promise<UsuariosPage> {
  const response = await apiClient.get<UsuariosPage>(`/usuarios${buildQuery(params)}`);
  if (!response.data) {
    throw new Error("Respuesta de listado sin datos");
  }
  return response.data;
}

export async function crearUsuario(body: CrearUsuarioRequest): Promise<Usuario> {
  const response = await apiClient.post<Usuario>("/usuarios", body);
  if (!response.data) {
    throw new Error("Respuesta de creación sin datos");
  }
  return response.data;
}

export async function actualizarUsuario(
  id: number,
  body: ActualizarUsuarioRequest,
): Promise<Usuario> {
  const response = await apiClient.put<Usuario>(`/usuarios/${id}`, body);
  if (!response.data) {
    throw new Error("Respuesta de actualización sin datos");
  }
  return response.data;
}

export async function actualizarActivo(id: number, activo: boolean): Promise<Usuario> {
  const response = await apiClient.patch<Usuario>(`/usuarios/${id}/activo`, { activo });
  if (!response.data) {
    throw new Error("Respuesta de activo sin datos");
  }
  return response.data;
}

export async function desactivarUsuario(id: number): Promise<void> {
  await apiClient.delete<void>(`/usuarios/${id}`);
}

export async function resetearPassword(id: number, password: string): Promise<Usuario> {
  const response = await apiClient.patch<Usuario>(`/usuarios/${id}/password`, { password });
  if (!response.data) {
    throw new Error("Respuesta de contraseña sin datos");
  }
  return response.data;
}
