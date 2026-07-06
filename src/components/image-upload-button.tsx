"use client";

import { useRef } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

import { EntityImage } from "@/components/entity-image";
import { Button } from "@/components/ui/button";
import { MAX_ORIGINAL_MB } from "@/features/storage/utils/comprimir-imagen";
import { cn } from "@/lib/utils";

interface ImageUploadButtonProps {
  value: string | null;
  label?: string;
  disabled?: boolean;
  uploading?: boolean;
  previewNombre: string;
  onUpload: (file: File) => Promise<string>;
  onRemove: () => Promise<void>;
}

export function ImageUploadButton({
  value,
  label = "Imagen",
  disabled = false,
  uploading = false,
  previewNombre,
  onUpload,
  onRemove,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = disabled || uploading;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await onUpload(file);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium leading-none">{label}</p>
      <div className="flex items-center gap-3">
        <EntityImage src={value} alt={previewNombre} size="lg" />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn("gap-2", busy && "pointer-events-none opacity-60")}
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Subir imagen
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive"
              disabled={busy}
              onClick={() => void onRemove()}
            >
              <Trash2 className="h-4 w-4" />
              Quitar
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG o WebP. Máx. {MAX_ORIGINAL_MB} MB original (se comprime automáticamente al subir).
      </p>
    </div>
  );
}
