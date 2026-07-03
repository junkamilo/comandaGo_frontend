"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import { getCategoriasPrincipalesActivas } from "@/features/categorias/utils/categoria-helpers";

const inputClassName = "h-11";

interface CategoriaPadreSelectProps {
  categorias: Categoria[];
  value: number | "none";
  onValueChange: (value: number | "none") => void;
  excludeId?: number;
  disabled?: boolean;
}

export function CategoriaPadreSelect({
  categorias,
  value,
  onValueChange,
  excludeId,
  disabled,
}: CategoriaPadreSelectProps) {
  const principales = getCategoriasPrincipalesActivas(categorias, excludeId);

  return (
    <Select
      value={value === "none" ? "none" : String(value)}
      onValueChange={(v) => onValueChange(v === "none" ? "none" : Number(v))}
      disabled={disabled}
    >
      <SelectTrigger className={inputClassName}>
        <SelectValue placeholder="Selecciona categoría padre" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Ninguna (categoría principal)</SelectItem>
        {principales.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {cat.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
