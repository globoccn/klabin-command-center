import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  action?: boolean;
  className?: string;
  children: ReactNode;
}

export function ChartCard({ title, action, className, children }: Props) {
  return (
    <div className={cn("card-premium rounded-2xl p-4 flex flex-col animate-fade-in-up", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {action && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary-glow cursor-pointer" />}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
