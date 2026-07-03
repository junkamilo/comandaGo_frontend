import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIAS } from "@/features/pos/data/mock-data";

export function CategoriasPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="h-11 gap-2">
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIAS.map((cat) => (
          <Card key={cat.id} className="border-border/60 bg-card/80">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl">{cat.icono}</span>
              <div>
                <p className="font-semibold">{cat.nombre}</p>
                <p className="text-sm text-muted-foreground">{cat.id}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
