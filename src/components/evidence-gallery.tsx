import { useState } from "react";
import { Camera, X } from "lucide-react";
import { evidencias } from "@/data/mockData";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const tipos = ["Todos", "Antes", "Depois", "Ronda", "CPD"] as const;

const badgeColor: Record<string, string> = {
  Antes: "bg-warning/15 text-warning border-warning/30",
  Depois: "bg-primary/15 text-primary-glow border-primary/30",
  Ronda: "bg-info/15 text-[color:var(--info)] border-info/30",
  CPD: "bg-chart-5/15 text-[color:var(--chart-5)] border-chart-5/30",
};

export function EvidenceGallery() {
  const [tipo, setTipo] = useState<string>("Todos");
  const [selected, setSelected] = useState<typeof evidencias[number] | null>(null);
  const filtered = tipo === "Todos" ? evidencias : evidencias.filter((e) => e.tipo === tipo);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Filter label="Tipo" value={tipo} onValueChange={setTipo} options={[...tipos]} />
        <Filter label="Andar" value="Todos" onValueChange={() => {}} options={["Todos", "1º andar", "5º andar", "10º andar"]} />
        <Filter label="Responsável" value="Todos" onValueChange={() => {}} options={["Todos", "Carlos Silva", "Maria Souza"]} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((e) => (
          <button key={e.id} onClick={() => setSelected(e)}
            className="card-premium rounded-2xl overflow-hidden text-left group hover:-translate-y-0.5 transition-transform">
            <div className="aspect-video relative flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${e.cor}22, #0B211C)` }}>
              <Camera className="h-8 w-8 text-primary-glow/40" />
              <span className={cn("absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full border", badgeColor[e.tipo])}>{e.tipo}</span>
            </div>
            <div className="p-3">
              <div className="text-sm font-medium truncate">{e.titulo}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{e.andar} · {e.responsavel}</div>
              <div className="text-[11px] text-muted-foreground">{fmtDate(e.data)}</div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl bg-card border-border">
          {selected && (
            <div className="grid md:grid-cols-[2fr_1fr] gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square rounded-xl flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${selected.cor}33, #0B211C)` }}>
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full border border-warning/30 bg-warning/15 text-warning">Antes</span>
                  <Camera className="h-10 w-10 text-primary-glow/40" />
                </div>
                <div className="aspect-square rounded-xl flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${selected.cor}55, #0D2A22)` }}>
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full border border-primary/30 bg-primary/15 text-primary-glow">Depois</span>
                  <Camera className="h-10 w-10 text-primary-glow/60" />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Tarefa</div>
                  <div className="font-medium">{selected.titulo}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">ID</div>
                  <div className="font-mono text-xs">{selected.taskId}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Andar</div>
                  <div>{selected.andar}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Responsável</div>
                  <div>{selected.responsavel}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Data</div>
                  <div>{fmtDate(selected.data)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Filter({ label, value, onValueChange, options }: { label: string; value: string; onValueChange: (v: string) => void; options: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card px-2 py-1 min-w-[140px]">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground px-1 pt-1">{label}</div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-7 border-0 bg-transparent px-1 text-xs focus:ring-0 shadow-none"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
