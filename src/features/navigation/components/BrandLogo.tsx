import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-1 px-3 py-2 text-xl font-bold tracking-tight">
      <span className="text-foreground">Comanda</span>
      <span className="text-primary">Go</span>
    </Link>
  );
}
