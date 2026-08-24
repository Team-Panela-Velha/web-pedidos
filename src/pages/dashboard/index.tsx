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
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Painel do restaurante
        </h1>
        <p className="text-sm text-muted-foreground">
          Visao geral operacional. Os indicadores serao alimentados pela API.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map(({ key, label, value, icon: Icon }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
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
