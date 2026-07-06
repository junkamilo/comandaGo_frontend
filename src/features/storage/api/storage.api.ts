import { apiClient } from "@/lib/api-client";

export type StorageBucket = "categorias" | "productos";

export interface UploadUrlResponse {
  signedUrl: string;
  publicUrl: string;
  objectPath: string;
}

export async function solicitarUploadUrl(bucket: StorageBucket): Promise<UploadUrlResponse> {
  const response = await apiClient.post<UploadUrlResponse>(`/storage/${bucket}/upload-url`, {
    extension: "webp",
  });
  if (!response.data) {
    throw new Error("Respuesta de subida sin datos");
  }
  return response.data;
}

export async function eliminarImagen(
  bucket: StorageBucket,
  payload: { objectPath?: string; publicUrl?: string },
): Promise<void> {
  await apiClient.delete(`/storage/${bucket}`, payload);
}

export async function solicitarUploadUrlCategoria(): Promise<UploadUrlResponse> {
  return solicitarUploadUrl("categorias");
}

export async function eliminarImagenCategoria(payload: {
  objectPath?: string;
  publicUrl?: string;
}): Promise<void> {
  await eliminarImagen("categorias", payload);
}

export async function solicitarUploadUrlProducto(): Promise<UploadUrlResponse> {
  return solicitarUploadUrl("productos");
}

export async function eliminarImagenProducto(payload: {
  objectPath?: string;
  publicUrl?: string;
}): Promise<void> {
  await eliminarImagen("productos", payload);
}
