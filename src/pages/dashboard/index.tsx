import { useEffect, useState } from "react";
import { useLogout } from "@refinedev/core";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { CalendarDays, ClipboardList, DollarSign, Loader2, RefreshCw, Receipt, TrendingUp, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { kyInstance } from "@/providers/data";

type RankedItem = { id: number; name: string; quantity: number; baseRevenue: number };
type DashboardData = {
  period: { from: string; to: string; timezone: string };
  orders: { total: number; byStatus: { status: string; count: number }[] };
  revenue: { total: number; averageTicket: number; addOns: number; closedTabs: number };
  tabs: { open: number; openValue: number };
  topProducts: RankedItem[];
  topCategories: RankedItem[];
  daily: { date: string; orders: number; revenue: number }[];
  dataQuality: { legacyExtraPricesEstimated: number; closedTabsWithoutDate: number };
};
type Preset = "today" | "7days" | "30days" | "custom";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const integer = new Intl.NumberFormat("pt-BR");
const shortDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });
const statusLabels: Record<string, string> = {
  RECEIVED: "Recebidos",
  IN_PREPARATION: "Em preparo",
  READY: "Prontos",
  DELIVERED: "Entregues",
  CANCELLED: "Cancelados",
};

function QuantityBars({ entries, color, label, unit }: {
  entries: { label: string; value: number }[];
  color: string;
  label: string;
  unit: string;
}) {
  return (
    <ChartContainer
      config={{ value: { label: "Quantidade", color } }}
      className="w-full aspect-auto"
      style={{ height: Math.max(120, entries.length * 46) }}
      aria-label={label}
    >
      <BarChart data={entries} layout="vertical" accessibilityLayer margin={{ left: 0, right: 36 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={116}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: string) => value.length > 16 ? `${value.slice(0, 15)}…` : value}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent
            labelFormatter={(_, payload) => payload[0]?.payload?.label ?? ""}
            formatter={(value) => <span className="font-medium tabular-nums">{integer.format(Number(value))} {unit}</span>}
          />}
        />
        <Bar dataKey="value" fill="var(--color-value)" maxBarSize={28} radius={[0, 6, 6, 0]}>
          <LabelList dataKey="value" position="right" className="fill-foreground text-xs tabular-nums" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function todayInRestaurant(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function daysBefore(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() - days);
  return value.toISOString().slice(0, 10);
}

function periodFor(preset: Preset): { from: string; to: string } {
  const to = todayInRestaurant();
  return { from: daysBefore(to, preset === "7days" ? 6 : preset === "30days" ? 29 : 0), to };
}

function Ranking({ title, items, empty, color }: { title: string; items: RankedItem[]; empty: string; color: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">{title}</CardTitle>
        <CardDescription>Quantidade de itens pedidos no período</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? <p className="py-6 text-sm text-muted-foreground">{empty}</p> : (
          <div className="space-y-5">
            <QuantityBars
              entries={items.map((item) => ({ label: item.name, value: item.quantity }))}
              color={color}
              label={`Gráfico de ${title.toLocaleLowerCase("pt-BR")}`}
              unit="un."
            />
            <ol className="space-y-3">
              {items.map((item, index) => (
                <li key={item.id} className="flex items-center gap-3 rounded-xl bg-secondary/55 px-4 py-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-icon-surface font-semibold text-accent-foreground">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-medium" title={item.name}>{item.name}</span>
                  <span className="text-sm font-semibold tabular-nums">{integer.format(item.quantity)} un.</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const Dashboard = () => {
  const { mutate: logout } = useLogout();
  const [preset, setPreset] = useState<Preset>("today");
  const [period, setPeriod] = useState(() => periodFor("today"));
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const validPeriod = Boolean(period.from && period.to && period.from <= period.to);

  useEffect(() => {
    if (!validPeriod) return;
    const controller = new AbortController();
    const params = new URLSearchParams(period);
    kyInstance.get(`dashboard?${params}`, { signal: controller.signal })
      .json<DashboardData>()
      .then((result) => { setData(result); setError(""); })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        const status = (cause as { response?: { status?: number } })?.response?.status;
        if (status === 401) { logout(); return; }
        setError(status === 403 ? "Você não tem permissão para ver o painel."
          : cause instanceof Error ? cause.message : "Não foi possível carregar o painel.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [period, reload, validPeriod, logout]);

  const changePreset = (value: Preset) => {
    setPreset(value);
    if (value !== "custom") { setLoading(true); setPeriod(periodFor(value)); }
  };
  const changeDate = (field: "from" | "to", value: string) => {
    setPreset("custom");
    setLoading(true);
    setPeriod((current) => ({ ...current, [field]: value }));
  };
  const retry = () => { setLoading(true); setReload((value) => value + 1); };

  const metrics = data ? [
    { label: "Pedidos criados", value: integer.format(data.orders.total), icon: ClipboardList, detail: "No período selecionado" },
    { label: "Receita de comandas", value: currency.format(data.revenue.total), icon: DollarSign, detail: `${integer.format(data.revenue.closedTabs)} comandas fechadas` },
    { label: "Ticket médio", value: currency.format(data.revenue.averageTicket), icon: TrendingUp, detail: "Por comanda fechada" },
    { label: "Receita de adicionais", value: currency.format(data.revenue.addOns), icon: Utensils, detail: "Incluída na receita das comandas" },
    { label: "Comandas abertas agora", value: integer.format(data.tabs.open), icon: Receipt, detail: currency.format(data.tabs.openValue) + " em aberto" },
  ] : [];
  const hasActivity = data && (data.orders.total > 0 || data.revenue.closedTabs > 0);

  return (
    <div className="flex flex-col gap-6 py-2 md:py-4">
      <div className="flex flex-col gap-5 rounded-2xl border bg-secondary/70 p-5 md:flex-row md:items-end md:justify-between md:p-7">
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-primary/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground">Operação</span>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Painel do restaurante</h1>
          <p className="text-sm text-muted-foreground">Pedidos pelo dia de criação; receita pelo fechamento da comanda.</p>
        </div>
        <Button variant="outline" onClick={retry} disabled={loading || !validPeriod} aria-label="Atualizar dashboard">
          {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />} Atualizar
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dashboard-preset" className="text-sm font-medium">Período</label>
            <select id="dashboard-preset" value={preset} onChange={(event) => changePreset(event.target.value as Preset)} className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
              <option value="today">Hoje</option><option value="7days">Últimos 7 dias</option><option value="30days">Últimos 30 dias</option><option value="custom">Personalizado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5"><label htmlFor="dashboard-from" className="text-sm font-medium">De</label><Input id="dashboard-from" type="date" value={period.from} onChange={(event) => changeDate("from", event.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="dashboard-to" className="text-sm font-medium">Até</label><Input id="dashboard-to" type="date" value={period.to} onChange={(event) => changeDate("to", event.target.value)} /></div>
          <span className="flex items-center gap-2 pb-2 text-xs text-muted-foreground"><CalendarDays className="size-4" /> Fuso: America/Sao_Paulo</span>
          {!validPeriod && <p role="alert" className="w-full text-sm text-destructive">Informe uma data inicial anterior ou igual à final.</p>}
        </CardContent>
      </Card>

      {error && <Card role="alert" className="border-destructive/50"><CardContent className="flex flex-wrap items-center justify-between gap-3"><span>Falha ao carregar os dados: {error}</span><Button variant="outline" onClick={retry}>Tentar novamente</Button></CardContent></Card>}
      {loading && !data ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Carregando dashboard">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-36 rounded-2xl" />)}</div> : null}

      {data && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-busy={loading}>
            {metrics.map(({ label, value, icon: Icon, detail }) => (
              <Card key={label} className="hover:border-primary/70">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-icon-surface text-accent-foreground"><Icon className="size-5" /></span></CardHeader>
                <CardContent><p className="font-display text-2xl font-bold tabular-nums lg:text-3xl">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent>
              </Card>
            ))}
          </div>
          {!hasActivity && <Card className="bg-icon-surface/55"><CardContent className="py-4 text-sm text-muted-foreground">Ainda não há pedidos criados nem comandas fechadas nesse período. As comandas abertas refletem a situação atual.</CardContent></Card>}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="font-display text-xl">Pedidos por dia</CardTitle><CardDescription>Pedidos criados em cada dia do período</CardDescription></CardHeader>
              <CardContent><ChartContainer config={{ orders: { label: "Pedidos", color: "var(--chart-1)" } }} className="h-64 w-full aspect-auto" aria-label="Gráfico de pedidos por dia">
                <BarChart data={data.daily} accessibilityLayer><CartesianGrid vertical={false} /><XAxis dataKey="date" tickFormatter={(value: string) => shortDate.format(new Date(`${value}T00:00:00Z`))} minTickGap={24} /><YAxis allowDecimals={false} width={30} /><ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => payload[0]?.payload?.date ?? ""} />} /><Bar dataKey="orders" fill="var(--color-orders)" radius={[5, 5, 0, 0]} /></BarChart>
              </ChartContainer></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="font-display text-xl">Receita por dia</CardTitle><CardDescription>Valor de comandas fechadas em cada dia</CardDescription></CardHeader>
              <CardContent><ChartContainer config={{ revenue: { label: "Receita", color: "var(--chart-2)" } }} className="h-64 w-full aspect-auto" aria-label="Gráfico de receita por dia">
                <AreaChart data={data.daily} accessibilityLayer><CartesianGrid vertical={false} /><XAxis dataKey="date" tickFormatter={(value: string) => shortDate.format(new Date(`${value}T00:00:00Z`))} minTickGap={24} /><YAxis tickFormatter={(value: number) => integer.format(value)} width={50} /><ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => payload[0]?.payload?.date ?? ""} formatter={(value) => currency.format(Number(value))} />} /><Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} fill="var(--color-revenue)" fillOpacity={0.18} dot={data.daily.length === 1} /></AreaChart>
              </ChartContainer></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Pedidos por status</CardTitle>
              <CardDescription>Distribuição dos pedidos criados no período, incluindo cancelados</CardDescription>
            </CardHeader>
            <CardContent>
              {data.orders.total === 0 ? (
                <p className="py-6 text-sm text-muted-foreground">Nenhum pedido criado neste período.</p>
              ) : (
                <div className="max-w-2xl">
                  <QuantityBars
                    entries={data.orders.byStatus.filter((item) => item.count > 0).map((item) => ({
                      label: statusLabels[item.status] ?? item.status,
                      value: item.count,
                    }))}
                    color="var(--chart-4)"
                    label="Gráfico de pedidos por status"
                    unit="pedidos"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-4 xl:grid-cols-2">
            <Ranking title="Produtos mais pedidos" items={data.topProducts} empty="Nenhum produto pedido neste período." color="var(--chart-3)" />
            <Ranking title="Categorias mais pedidas" items={data.topCategories} empty="Nenhuma categoria com itens pedidos neste período." color="var(--chart-5)" />
          </div>
          <Card className="bg-icon-surface/55"><CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Receita corresponde ao total registrado nas comandas fechadas, sem confirmação separada de pagamento. O ticket médio é calculado por comanda fechada.</p>
            {data.dataQuality.legacyExtraPricesEstimated > 0 && <p>O valor de adicionais inclui {integer.format(data.dataQuality.legacyExtraPricesEstimated)} lançamentos antigos estimados pelo preço atual do adicional.</p>}
            {data.dataQuality.closedTabsWithoutDate > 0 && <p>{integer.format(data.dataQuality.closedTabsWithoutDate)} comandas antigas fechadas não possuem data de fechamento e não entram na receita por período.</p>}
          </CardContent></Card>
        </>
      )}
    </div>
  );
};
