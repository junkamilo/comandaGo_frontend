"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  eliminarImagen,
  solicitarUploadUrl,
  type StorageBucket,
} from "@/features/storage/api/storage.api";
import { comprimirImagen } from "@/features/storage/utils/comprimir-imagen";
import { ApiError } from "@/lib/api-error";

export function useUploadImagen(bucket: StorageBucket) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const subirImagen = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      try {
        const comprimida = await comprimirImagen(file);
        const { signedUrl, publicUrl } = await solicitarUploadUrl(bucket);

        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/webp" },
          body: comprimida,
        });

        if (!uploadResponse.ok) {
          throw new Error("No se pudo subir la imagen al almacenamiento");
        }

        return publicUrl;
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Error al subir la imagen";
        toast.error(message);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [bucket],
  );

  const quitarImagen = useCallback(
    async (publicUrl: string | null) => {
      if (!publicUrl) return;
      setIsDeleting(true);
      try {
        await eliminarImagen(bucket, { publicUrl });
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Error al eliminar la imagen";
        toast.error(message);
        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [bucket],
  );

  return {
    subirImagen,
    quitarImagen,
    isUploading,
    isDeleting,
    isBusy: isUploading || isDeleting,
  };
}

export function useUploadImagenCategoria() {
  return useUploadImagen("categorias");
}

export function useUploadImagenProducto() {
  return useUploadImagen("productos");
}
