"use client";

import { useState } from "react";
import { KeyRound, MoreVertical, Pencil, UserX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesactivarUsuario } from "@/features/personal/hooks/use-desactivar-usuario";
import type { Usuario } from "@/features/personal/types/usuario.types";
import { ROL_LABEL } from "@/features/navigation/modulos-data";
import { getSession } from "@/lib/auth-storage";

interface PersonalListProps {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
  onResetPassword: (usuario: Usuario) => void;
}

export function PersonalList({ usuarios, onEditar, onResetPassword }: PersonalListProps) {
  const session = getSession();
  const [desactivarTarget, setDesactivarTarget] = useState<Usuario | null>(null);
  const { desactivarUsuario, isDesactivando } = useDesactivarUsuario(() =>
    setDesactivarTarget(null),
  );

  function confirmarDesactivar() {
    if (!desactivarTarget) return;
    desactivarUsuario(desactivarTarget.id);
  }

  if (usuarios.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-muted-foreground">
        No hay usuarios para mostrar con este filtro.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {usuarios.map((usuario) => {
          const isSelf = session?.id === usuario.id;

          return (
            <Card key={usuario.id} className="border-border/60 bg-card/80">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{usuario.nombre}</p>
                  <p className="truncate text-sm text-muted-foreground">{usuario.email}</p>
                  {usuario.telefono && (
                    <p className="text-sm text-muted-foreground">{usuario.telefono}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{ROL_LABEL[usuario.rol]}</Badge>
                    <Badge variant={usuario.activo ? "default" : "secondary"}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                    {isSelf && (
                      <Badge variant="outline" className="text-xs">
                        Tú
                      </Badge>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEditar(usuario)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(usuario)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Restablecer contraseña
                      </DropdownMenuItem>
                      {!isSelf && usuario.activo && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDesactivarTarget(usuario)}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Desactivar
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={desactivarTarget !== null}
        onOpenChange={(open) => !open && setDesactivarTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              {desactivarTarget?.nombre} no podrá iniciar sesión. El historial se conserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarDesactivar}
              disabled={isDesactivando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
