"use client";

import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import {
  formatCategoriaLabel,
  getCategoriasHoja,
} from "@/features/productos/utils/producto-helpers";

const inputClassName = "h-11";
const SIN_CATEGORIA_VALUE = "__none__";

interface CategoriaHojaSelectProps {
  categorias: Categoria[];
  value: number | null | undefined;
  onValueChange: (value: number | null) => void;
  disabled?: boolean;
  /** Si true, permite "Sin categoría" (insumos internos). */
  allowEmpty?: boolean;
  requiredEmptyLabel?: string;
}

export function CategoriaHojaSelect({
  categorias,
  value,
  onValueChange,
  disabled,
  allowEmpty = false,
  requiredEmptyLabel = "Sin categoría (solo receta)",
}: CategoriaHojaSelectProps) {
  const hojas = getCategoriasHoja(categorias);

  if (hojas.length === 0 && !allowEmpty) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay categorías hoja disponibles.{" "}
        <Link href="/carta/categorias" className="text-primary underline-offset-4 hover:underline">
          Crea una categoría hoja primero
        </Link>
        .
      </p>
    );
  }

  return (
    <Select
      value={value != null && value > 0 ? String(value) : allowEmpty ? SIN_CATEGORIA_VALUE : undefined}
      onValueChange={(v) => onValueChange(v === SIN_CATEGORIA_VALUE ? null : Number(v))}
      disabled={disabled}
    >
      <SelectTrigger className={inputClassName}>
        <SelectValue placeholder={allowEmpty ? "Opcional" : "Selecciona categoría"} />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && (
          <SelectItem value={SIN_CATEGORIA_VALUE}>{requiredEmptyLabel}</SelectItem>
        )}
        {hojas.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {formatCategoriaLabel(cat)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
