import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Utensils,
  DollarSign,
  Table2,
} from "lucide-react";

type Indicator = {
  key: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Indicadores previstos no CLAUDE.md (§10). Os valores reais devem vir da
// API Spring Boot — aqui ficam apenas placeholders enquanto o backend nao
// esta conectado.
const indicators: Indicator[] = [
  { key: "orders", label: "Pedidos hoje", value: "—", icon: ClipboardList },
  { key: "in_progress", label: "Pedidos em andamento", value: "—", icon: Clock },
  { key: "finished", label: "Pedidos finalizados", value: "—", icon: CheckCircle2 },
  { key: "tables", label: "Mesas ocupadas", value: "—", icon: Table2 },
  { key: "menu", label: "Produtos no cardapio", value: "—", icon: Utensils },
  { key: "revenue", label: "Faturamento", value: "—", icon: DollarSign },
];

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 py-2 md:py-4">
      <div className="flex flex-col gap-2 rounded-2xl border bg-secondary/70 p-5 md:p-7">
        <span className="w-fit rounded-full bg-primary/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground">
          Operação
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Painel do restaurante
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Visao geral operacional. Os indicadores serao alimentados pela API.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map(({ key, label, value, icon: Icon }) => (
          <Card key={key} className="group hover:border-primary/70 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <span className="flex size-10 items-center justify-center rounded-xl bg-icon-surface text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent>
              <span className="font-display text-3xl font-bold">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-icon-surface/55">
        <CardHeader>
          <CardTitle>RMS — Sistema de Gerenciamento</CardTitle>
          <CardDescription>
            Interface administrativa do sistema de pedidos e comandas. Todos os
            dados sao fornecidos pela API REST (Spring Boot); o frontend nao
            acessa o banco diretamente.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
