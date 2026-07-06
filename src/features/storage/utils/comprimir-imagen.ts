import imageCompression from "browser-image-compression";

export const MAX_ORIGINAL_MB = 20;
export const MAX_ORIGINAL_BYTES = MAX_ORIGINAL_MB * 1024 * 1024;
const TARGET_SIZE_MB = 0.5;
const MAX_DIMENSION = 1200;
const OUTPUT_TYPE = "image/webp";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validarArchivoImagen(file: File): void {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Solo se permiten imágenes JPG, PNG o WebP");
  }
  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error(`La imagen es demasiado grande (máx. ${MAX_ORIGINAL_MB} MB original)`);
  }
}

export async function comprimirImagen(file: File): Promise<File> {
  validarArchivoImagen(file);

  return imageCompression(file, {
    maxSizeMB: TARGET_SIZE_MB,
    maxWidthOrHeight: MAX_DIMENSION,
    fileType: OUTPUT_TYPE,
    useWebWorker: true,
  });
}
