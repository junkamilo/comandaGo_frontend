"use client";

import { BrandLogo } from "@/features/navigation/components/BrandLogo";
import { NavLinks } from "@/features/navigation/components/NavLinks";
import { UserFooter } from "@/features/navigation/components/UserFooter";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";

export function AppSidebar() {
  const { session, grupos, mounted } = useNavigation();

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 md:flex">
      <div className="border-b border-border/60 py-4">
        <BrandLogo />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mounted && session ? <NavLinks modulos={[]} grupos={grupos} /> : null}
      </div>
      {mounted && session ? <UserFooter session={session} /> : null}
    </aside>
  );
}
