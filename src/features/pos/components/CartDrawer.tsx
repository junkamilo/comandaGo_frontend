"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ComandaContent, type ComandaContentProps } from "@/features/pos/components/ComandaContent";

interface CartDrawerProps extends Omit<ComandaContentProps, "showMesaSelector"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange, ...comandaProps }: CartDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex h-[85dvh] max-h-[85dvh] flex-col overflow-hidden">
        <DrawerHeader className="shrink-0 border-b border-border/60 pb-2 text-left">
          <DrawerTitle>Comanda</DrawerTitle>
        </DrawerHeader>
        <ComandaContent
          {...comandaProps}
          showTitle={false}
          showMesaSelector={false}
          ocultarFooterCarritoVacio
          className="min-h-0 flex-1 overflow-hidden"
        />
      </DrawerContent>
    </Drawer>
  );
}
