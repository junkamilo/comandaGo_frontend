"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FILTROS_ESTADO,
  FILTROS_ROL,
  type FiltroPersonal,
} from "@/features/personal/constants/filtros-personal";
import { EditarUsuarioDialog } from "@/features/personal/components/EditarUsuarioDialog";
import { NuevoUsuarioDialog } from "@/features/personal/components/NuevoUsuarioDialog";
import { PersonalList } from "@/features/personal/components/PersonalList";
import { ResetPasswordDialog } from "@/features/personal/components/ResetPasswordDialog";
import { useUsuarios } from "@/features/personal/hooks/use-usuarios";
import type { Usuario } from "@/features/personal/types/usuario.types";

function PersonalListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function PersonalPage() {
  const [filtro, setFiltro] = useState<FiltroPersonal>("todos");
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [editarUsuario, setEditarUsuario] = useState<Usuario | null>(null);
  const [resetUsuario, setResetUsuario] = useState<Usuario | null>(null);

  const { usuarios, isLoading, isError, refetch } = useUsuarios({ filtro });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={filtro} onValueChange={(v) => setFiltro(v as FiltroPersonal)}>
          <SelectTrigger className="h-11 w-full sm:w-52">
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estado</SelectLabel>
              {FILTROS_ESTADO.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Rol</SelectLabel>
              {FILTROS_ROL.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="h-11 w-full gap-2 sm:w-auto" onClick={() => setNuevoOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </Button>
      </div>

      {isLoading && <PersonalListSkeleton />}

      {isError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">No se pudo cargar el personal.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <PersonalList
          usuarios={usuarios}
          onEditar={setEditarUsuario}
          onResetPassword={setResetUsuario}
        />
      )}

      <NuevoUsuarioDialog open={nuevoOpen} onOpenChange={setNuevoOpen} />

      <EditarUsuarioDialog
        usuario={editarUsuario}
        open={editarUsuario !== null}
        onOpenChange={(open) => !open && setEditarUsuario(null)}
      />

      <ResetPasswordDialog
        usuario={resetUsuario}
        open={resetUsuario !== null}
        onOpenChange={(open) => !open && setResetUsuario(null)}
      />
    </div>
  );
}
