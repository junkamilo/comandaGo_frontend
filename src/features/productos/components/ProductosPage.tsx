import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRODUCTOS } from "@/features/pos/data/mock-data";
import { formatCOP } from "@/lib/format-cop";

export function ProductosPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="h-11 gap-2">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>
      <div className="space-y-3">
        {PRODUCTOS.map((p) => (
          <Card key={p.id} className="border-border/60 bg-card/80">
            <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{p.nombre}</p>
                <p className="text-sm text-muted-foreground capitalize">{p.categoriaId}</p>
              </div>
              <p className="text-lg font-bold text-primary">{formatCOP(p.precio)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
