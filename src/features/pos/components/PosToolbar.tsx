import { ChefHat } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface PosToolbarProps {
  itemsCount: number;
}

export function PosToolbar({ itemsCount }: PosToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-2 border-b border-border/60 px-3 py-2 md:px-6">
      <Badge variant="outline" className="hidden gap-1 sm:flex">
        <ChefHat className="h-3.5 w-3.5" />
        Modo mesero
      </Badge>
      {itemsCount > 0 && (
        <Badge className="bg-primary text-primary-foreground">{itemsCount} ítems</Badge>
      )}
    </div>
  );
}
