import { useState } from "react";

import { cn } from "@/lib/utils";

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const periods = ["Manhã", "Tarde", "Noite"];
const kinds = ["Livre", "Trabalho", "Estudo", "Indisponível"] as const;
type Kind = (typeof kinds)[number];
const style: Record<Kind, string> = {
  Livre: "bg-success-soft text-success border-success/30",
  Trabalho: "bg-primary-soft text-primary border-primary/30",
  Estudo: "bg-highlight-soft text-highlight-foreground border-highlight/40",
  Indisponível: "bg-muted text-muted-foreground border-border",
};

export function AvailabilityGrid() {
  const [grid, setGrid] = useState<Kind[][]>(() =>
    periods.map((p) => days.map((d, i) => (i >= 5 ? (p === "Noite" ? "Indisponível" : "Livre") : p === "Manhã" ? "Trabalho" : p === "Tarde" ? "Estudo" : "Livre"))),
  );
  const cycle = (r: number, c: number) => setGrid((g) => g.map((row, ri) => row.map((k, ci) => (ri === r && ci === c ? (kinds[(kinds.indexOf(k) + 1) % kinds.length] as Kind) : k))));
  const free = grid.flat().filter((k) => k === "Livre").length * 4;
  return (
    <div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[520px] grid-cols-[64px_repeat(7,1fr)] gap-1.5">
          <span />
          {days.map((d) => <span key={d} className="text-center text-xs font-bold text-muted-foreground">{d}</span>)}
          {periods.map((p, r) => [
            <span key={p} className="self-center text-xs font-bold text-muted-foreground">{p}</span>,
            ...days.map((d, c) => (
              <button key={d + p} type="button" onClick={() => cycle(r, c)} className={cn("h-12 rounded-lg border text-[10px] font-bold transition hover:scale-[1.03]", style[grid[r]?.[c] ?? "Livre"])}>{grid[r]?.[c]}</button>
            )),
          ])}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {kinds.map((k) => <span key={k} className="flex items-center gap-1.5"><span className={cn("size-3 rounded border", style[k])} />{k}</span>)}
        <span className="ml-auto font-semibold text-foreground">≈ {free}h livres por semana</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Toque em um período para alternar. O planejamento automático usa apenas os períodos livres.</p>
    </div>
  );
}
