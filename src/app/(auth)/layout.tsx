import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-background">
      {children}
    </div>
  );
}
