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
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border/60 pb-2 text-left">
          <DrawerTitle>Comanda</DrawerTitle>
        </DrawerHeader>
        <ComandaContent
          {...comandaProps}
          showTitle={false}
          showMesaSelector={false}
          className="max-h-[calc(85vh-3rem)]"
        />
      </DrawerContent>
    </Drawer>
  );
}
