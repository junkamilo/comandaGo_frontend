"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "@/features/navigation/components/BrandLogo";
import { NavLinks } from "@/features/navigation/components/NavLinks";
import { UserFooter } from "@/features/navigation/components/UserFooter";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { session, grupos, mounted } = useNavigation();

  if (!mounted || !session) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0 md:hidden"
        disabled
        aria-hidden
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[min(100vw-2rem,20rem)] flex-col p-0">
        <SheetHeader className="border-b border-border/60 px-4 py-4 text-left">
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <BrandLogo />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <NavLinks modulos={[]} grupos={grupos} onNavigate={() => setOpen(false)} />
        </div>
        <UserFooter session={session} />
      </SheetContent>
    </Sheet>
  );
}
