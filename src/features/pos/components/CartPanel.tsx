import { ComandaContent, type ComandaContentProps } from "@/features/pos/components/ComandaContent";

type CartPanelProps = Omit<ComandaContentProps, "showTitle" | "showMesaSelector" | "className">;

export function CartPanel(props: CartPanelProps) {
  return (
    <aside className="hidden min-h-0 w-80 shrink-0 flex-col border-l border-border/60 bg-card/30 md:flex lg:w-96">
      <ComandaContent {...props} />
    </aside>
  );
}
