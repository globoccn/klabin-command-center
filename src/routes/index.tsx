import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Database,
  Image as ImageIcon,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Target,
} from "lucide-react";
import { DEFAULT_FILTERS } from "@/components/filter-bar";
import { OverviewFilters } from "@/components/overview-filters";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getOverview } from "@/services/dashboardService";
import type { DashboardFilters, DashboardOverview, Kpi } from "@/types/dashboard";
import { fmtDateTime, fmtDec, fmtInt } from "@/lib/format";
import { kpiById, operationalModel, periodInsight, recommendationsFor, type OverviewRecommendation, type RecommendationTone } from "@/lib/overview-analysis";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral · Central Operacional Klabin" },
      { name: "description", content: "Visão executiva da operação Klabin com indicadores, prioridades e recomendações baseadas nos dados do período." },
      { property: "og:title", content: "Visão Geral · Central Operacional Klabin" },
      { property: "og:description", content: "Saúde operacional, chamados, rondas, qualidade e evidências em uma visão executiva." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (data) setRefreshing(true);
    setError(null);

    getOverview(filters)
      .then((result) => {
        if (!active) return;
        setData(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Não foi possível atualizar a Visão Geral.");
      })
      .finally(() => {
        if (active) setRefreshing(false);
      });

    return () => { active = false; };
  }, [filters, retryKey]);

  const model = useMemo(() => data ? operationalModel(data) : null, [data]);
  const recommendations = useMemo(() => data ? recommendationsFor(data) : [], [data]);

  return (
    <div className="command-page overview-command-page overview-light-page animate-fade-in-up">
      <header className="overview-executive-header">
        <div className="overview-title-block">
          <div className="overview-eyebrow">Central Operacional Klabin</div>
          <h1>Visão Geral</h1>
          <p>Inteligência em operações, manutenção e facility management</p>
          <div className="overview-update-line">
            <span className={cn("overview-live-dot", error && "is-error")} />
            {data?.snapshot?.loadedAt ? `Base atualizada em ${fmtDateTime(data.snapshot.loadedAt)}` : "Carregando base operacional"}
            {refreshing && <span className="overview-refreshing"><RefreshCw className="h-3 w-3 animate-spin" /> Atualizando…</span>}
          </div>
        </div>
        <OverviewFilters value={filters} onApply={setFilters} />
      </header>

      {error && (
        <div className="overview-error-banner" role="alert">
          <div>
            <strong>Não foi possível atualizar os dados.</strong>
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setRetryKey((current) => current + 1)}>Tentar novamente</button>
        </div>
      )}

      {!data ? (
        <OverviewLoading />
      ) : (
        <>
          <section className="overview-kpi-grid" aria-label="Indicadores principais">
            {["total", "concluidas", "abertas", "taxa"].map((id) => {
              const kpi = kpiById(data, id);
              return kpi ? <ExecutiveKpi key={id} kpi={kpi} /> : null;
            })}
          </section>

          <section className="overview-main-grid">
            {model && <OperationalHealth data={data} model={model} />}
            <Recommendations items={recommendations} />
          </section>

          <section className="overview-detail-grid">
            <ClimateCard data={data} />
            <RoundsCard data={data} />
            <QualityCard data={data} />
            <EvidenceCard data={data} />
          </section>

          <section className="overview-insight-strip">
            <div className="overview-insight-icon"><Target className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <strong>Insight do período</strong>
              <span>{periodInsight(data)}</span>
            </div>
            <Link to="/relatorios">Ver relatório completo <ArrowRight className="h-3.5 w-3.5" /></Link>
          </section>
        </>
      )}
    </div>
  );
}

function ExecutiveKpi({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.id === "total" ? ClipboardList : kpi.id === "concluidas" ? CheckCircle2 : kpi.id === "abertas" ? Clock3 : Target;
  const deltaGood = kpi.id === "abertas" ? kpi.delta <= 0 : kpi.delta >= 0;
  const DeltaIcon = kpi.delta === 0 ? ArrowRight : kpi.delta > 0 ? ArrowUpRight : ArrowDownRight;
  const suffix = kpi.suffix ?? "";
  const deltaUnit = kpi.deltaUnit ?? "%";

  return (
    <article className={cn("overview-kpi-card", kpi.id === "abertas" && "is-warning")}>
      <div className="overview-kpi-icon"><Icon className="h-5 w-5" /></div>
      <div className="overview-kpi-copy">
        <div className="overview-kpi-label">{kpi.label}</div>
        <div className="overview-kpi-value">{typeof kpi.value === "number" ? fmtInt(kpi.value) : kpi.value}{suffix}</div>
        <div className="overview-kpi-comparison">
          <span className={cn("overview-kpi-delta", deltaGood ? "is-good" : "is-bad")}>
            <DeltaIcon className="h-3 w-3" /> {kpi.delta > 0 ? "+" : ""}{fmtDec(kpi.delta)}{deltaUnit}
          </span>
          <span>{kpi.comparison}</span>
        </div>
      </div>
    </article>
  );
}

function OperationalHealth({ data, model }: { data: DashboardOverview; model: ReturnType<typeof operationalModel> }) {
  return (
    <article className="overview-health-card">
      <div className="overview-health-image" aria-hidden="true" />
      <div className="overview-health-overlay" aria-hidden="true" />
      <div className="overview-health-content">
        <div className="overview-health-heading">
          <div>
            <div className="overview-card-title"><Snowflake className="h-4 w-4" /> Saúde da operação</div>
            <p>Visão consolidada dos indicadores disponíveis no período selecionado.</p>
          </div>
          <span className={cn("overview-health-status", `is-${model.status.tone}`)}><span />{model.status.label}</span>
        </div>

        <div className="overview-health-body">
          <div className="overview-score-ring" style={{ "--score": `${model.score * 3.6}deg` } as CSSProperties}>
            <div><strong>{model.score}</strong><span>de 100</span></div>
          </div>
          <div className="overview-health-message">
            <h2>{model.status.headline}</h2>
            <p>Índice composto por taxa de conclusão, cobertura de evidências, preenchimento de setor e proporção de backlog acima de 90 dias.</p>
          </div>
        </div>

        <div className="overview-health-metrics">
          <HealthMetric icon={<AlertTriangle className="h-4 w-4" />} value={fmtInt(model.criticalBacklog)} label="Backlog > 90 dias" tone="warning" />
          <HealthMetric icon={<Database className="h-4 w-4" />} value={fmtInt(data.qualidadeDados.camposDuplicados)} label="Registros duplicados" />
          <HealthMetric icon={<Camera className="h-4 w-4" />} value={`${fmtDec(model.evidenceRate)}%`} label="Cobertura de evidências" tone="positive" />
          <HealthMetric icon={<Clock3 className="h-4 w-4" />} value={`${fmtDec(data.idadeMediana)} d`} label="Idade mediana do backlog" />
        </div>
      </div>
    </article>
  );
}

function HealthMetric({ icon, value, label, tone = "neutral" }: { icon: ReactNode; value: string; label: string; tone?: "neutral" | "positive" | "warning" }) {
  return <div className={cn("overview-health-metric", `is-${tone}`)}><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>;
}

function Recommendations({ items }: { items: OverviewRecommendation[] }) {
  return (
    <article className="overview-white-card overview-recommendations-card">
      <div className="overview-card-heading-row">
        <div>
          <div className="overview-white-title"><Target className="h-4 w-4" /> Recomendações para sua operação</div>
          <p>Priorização determinística baseada nos indicadores do período.</p>
        </div>
      </div>
      <div className="overview-recommendation-list">
        {items.map((item, index) => (
          <Link key={`${item.title}-${index}`} to={item.href} className="overview-recommendation-row">
            <span className="overview-recommendation-rank">{index + 1}</span>
            <span className="overview-recommendation-symbol"><RecommendationIcon href={item.href} /></span>
            <span className="overview-recommendation-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
            <span className={cn("overview-priority-badge", `is-${item.tone}`)}>{priorityLabel(item.tone)}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#0c392c]" />
          </Link>
        ))}
      </div>
    </article>
  );
}

function RecommendationIcon({ href }: { href: OverviewRecommendation["href"] }) {
  if (href === "/climatizacao") return <Snowflake className="h-4 w-4" />;
  if (href === "/rondas") return <ClipboardCheck className="h-4 w-4" />;
  if (href === "/evidencias") return <ImageIcon className="h-4 w-4" />;
  if (href === "/qualidade") return <Database className="h-4 w-4" />;
  return <ClipboardList className="h-4 w-4" />;
}

function priorityLabel(tone: RecommendationTone) {
  if (tone === "high") return "Alta";
  if (tone === "medium") return "Média";
  if (tone === "positive") return "Estável";
  return "Baixa";
}

function ClimateCard({ data }: { data: DashboardOverview }) {
  const total = data.climatizacaoTipo.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const max = Math.max(1, ...data.climatizacaoTipo.map((item) => Number(item.value || 0)));
  const topSector = data.topSetoresClimatizacao[0];

  return (
    <DetailCard title="Climatização" subtitle="Chamados classificados no período" icon={<Snowflake className="h-4 w-4" />} href="/climatizacao">
      <div className="overview-detail-highlight"><strong>{fmtInt(total)}</strong><span>chamados no período</span></div>
      <div className="overview-mini-bars">
        {data.climatizacaoTipo.map((item) => (
          <MiniBar key={item.name} label={item.name} value={item.value} max={max} />
        ))}
      </div>
      <div className="overview-detail-footer">
        {topSector ? <><span>Setor com mais registros</span><strong>{topSector.name} · {fmtInt(topSector.value)}</strong></> : <span>Sem chamados de climatização no período.</span>}
      </div>
    </DetailCard>
  );
}

function RoundsCard({ data }: { data: DashboardOverview }) {
  const max = Math.max(1, ...data.atividadesRonda.map((item) => Number(item.value || 0)));
  const shown = data.atividadesRonda.slice(0, 5);
  const totalShown = shown.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <DetailCard title="Rondas" subtitle="Principais atividades registradas" icon={<ClipboardCheck className="h-4 w-4" />} href="/rondas">
      <div className="overview-detail-highlight"><strong>{fmtInt(totalShown)}</strong><span>registros nas principais atividades</span></div>
      <div className="overview-mini-bars is-compact">
        {shown.map((item) => <MiniBar key={item.name} label={item.name} value={item.value} max={max} />)}
      </div>
    </DetailCard>
  );
}

function QualityCard({ data }: { data: DashboardOverview }) {
  const coverage = Math.max(0, Math.min(100, Number(data.qualidadeDados.coberturaSetor || 0)));
  return (
    <DetailCard title="Qualidade dos Dados" subtitle="Integridade e consistência dos registros" icon={<Database className="h-4 w-4" />} href="/qualidade">
      <div className="overview-gauge-layout">
        <div className="overview-small-gauge" style={{ "--score": `${coverage * 3.6}deg` } as CSSProperties}>
          <div><strong>{fmtDec(coverage)}%</strong><span>setor preenchido</span></div>
        </div>
        <div className="overview-quality-stats">
          <QualityStat label="Sem vencimento" value={data.qualidadeDados.semVencimento} />
          <QualityStat label="Duplicidades" value={data.qualidadeDados.camposDuplicados} warning />
          <QualityStat label="Fechamento anterior" value={data.qualidadeDados.fechamentoAnterior} warning />
        </div>
      </div>
      <div className="overview-detail-footer is-positive"><ShieldCheck className="h-3.5 w-3.5" /><span>Cobertura de setor calculada com os chamados do período.</span></div>
    </DetailCard>
  );
}

function EvidenceCard({ data }: { data: DashboardOverview }) {
  const coverage = Math.max(0, Math.min(100, Number(data.evidencias.percentualComEvidencia || 0)));
  const kpi = kpiById(data, "anexos");
  return (
    <DetailCard title="Evidências" subtitle="Cobertura fotográfica das tarefas" icon={<ImageIcon className="h-4 w-4" />} href="/evidencias">
      <div className="overview-evidence-summary">
        <div className="overview-small-gauge" style={{ "--score": `${coverage * 3.6}deg` } as CSSProperties}>
          <div><strong>{fmtDec(coverage)}%</strong><span>com evidência</span></div>
        </div>
        <div className="overview-evidence-stats">
          <div><strong>{fmtInt(data.evidencias.totalFotos)}</strong><span>fotos</span></div>
          <div><strong>{fmtInt(data.evidencias.tarefasComFotos)}</strong><span>tarefas com fotos</span></div>
        </div>
      </div>
      <div className="overview-detail-footer is-positive"><Camera className="h-3.5 w-3.5" /><strong>{kpi ? `${kpi.delta >= 0 ? "+" : ""}${fmtDec(kpi.delta)}%` : "—"}</strong><span>{kpi?.comparison ?? "comparativo indisponível"}</span></div>
    </DetailCard>
  );
}

function DetailCard({ title, subtitle, icon, href, children }: { title: string; subtitle: string; icon: ReactNode; href: "/climatizacao" | "/rondas" | "/qualidade" | "/evidencias"; children: ReactNode }) {
  return (
    <article className="overview-white-card overview-detail-card">
      <div className="overview-card-heading-row">
        <div>
          <div className="overview-white-title">{icon}{title}</div>
          <p>{subtitle}</p>
        </div>
        <Link to={href}>Ver detalhes <ArrowRight className="h-3 w-3" /></Link>
      </div>
      <div className="overview-detail-content">{children}</div>
    </article>
  );
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max > 0 ? Math.max(3, (Number(value || 0) / max) * 100) : 0;
  return (
    <div className="overview-mini-bar-row">
      <span title={label}>{label}</span>
      <div><i style={{ width: `${width}%` }} /></div>
      <strong>{fmtInt(Number(value || 0))}</strong>
    </div>
  );
}

function QualityStat({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) {
  return <div className={cn("overview-quality-stat", warning && Number(value) > 0 && "is-warning")}><span>{label}</span><strong>{fmtInt(Number(value || 0))}</strong></div>;
}

function OverviewLoading() {
  return (
    <div className="space-y-3">
      <div className="overview-kpi-grid">{Array.from({ length: 4 }, (_, index) => <LoadingSkeleton key={index} className="h-[108px]" />)}</div>
      <div className="overview-main-grid"><LoadingSkeleton className="h-[360px]" /><LoadingSkeleton className="h-[360px]" /></div>
      <div className="overview-detail-grid">{Array.from({ length: 4 }, (_, index) => <LoadingSkeleton key={index} className="h-[270px]" />)}</div>
    </div>
  );
}
