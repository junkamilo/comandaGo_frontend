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

interface CategoriaHojaSelectProps {
  categorias: Categoria[];
  value: number | undefined;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export function CategoriaHojaSelect({
  categorias,
  value,
  onValueChange,
  disabled,
}: CategoriaHojaSelectProps) {
  const hojas = getCategoriasHoja(categorias);

  if (hojas.length === 0) {
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
      value={value ? String(value) : undefined}
      onValueChange={(v) => onValueChange(Number(v))}
      disabled={disabled}
    >
      <SelectTrigger className={inputClassName}>
        <SelectValue placeholder="Selecciona categoría" />
      </SelectTrigger>
      <SelectContent>
        {hojas.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {formatCategoriaLabel(cat)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
