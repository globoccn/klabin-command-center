import { Inbox } from "lucide-react";
export function EmptyState({ title = "Nada por aqui", description = "Nenhum registro encontrado com os filtros atuais." }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-2xl grid place-items-center bg-card border border-border">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="mt-3 text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</div>
    </div>
  );
}
