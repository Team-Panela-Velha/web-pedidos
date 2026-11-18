import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { useNotification } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderService } from "@/services/order/orderService";
import type { KitchenOrderPage, OrderResponse } from "@/types/order/orderTypes";

const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
const statusLabels: Record<OrderResponse["status"], string> = {
  RECEIVED: "Recebido",
  IN_PREPARATION: "Em preparo",
  READY: "Pronto",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};
const pageSize = 20;

export const OrdersPage = () => {
  const { open } = useNotification();
  const [filter, setFilter] = useState<"pending" | "delivered" | "all">("pending");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<KitchenOrderPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deliveringId, setDeliveringId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const delivered = filter === "all" ? "all" : filter === "delivered";
      setData(await orderService.getKitchenOrders(delivered, page, pageSize));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { void loadOrders(); }, [loadOrders]);

  const markDelivered = async (id: number) => {
    setDeliveringId(id);
    try {
      const updated = await orderService.markDelivered(id);
      setData((current) => current ? {
        ...current,
        content: current.content.map((order) => order.id === updated.id ? updated : order),
      } : current);
      open?.({ message: "Pedido marcado como entregue", type: "success" });
    } catch (cause) {
      open?.({ message: "Não foi possível marcar o pedido como entregue", description: String(cause), type: "error" });
    } finally {
      setDeliveringId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Acompanhe os pedidos e confirme as entregas.</p>
          <h1 className="font-heading text-3xl font-bold">Pedidos</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Filtrar pedidos por entrega" className="h-10 rounded-xl border border-input bg-background px-3 text-sm" value={filter}
            onChange={(event) => { setFilter(event.target.value as typeof filter); setPage(0); }}>
            <option value="pending">Pendentes</option>
            <option value="delivered">Entregues</option>
            <option value="all">Todos</option>
          </select>
          <Button variant="outline" onClick={() => void loadOrders()} disabled={loading}>
            <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center rounded-2xl border bg-card p-12"><Loader2 className="size-6 animate-spin" aria-label="Carregando pedidos" /></div>
      ) : error ? (
        <div className="rounded-2xl border bg-card p-8 text-center">
          <p className="mb-3 text-destructive">Não foi possível carregar os pedidos.</p>
          <Button variant="outline" onClick={() => void loadOrders()}>Tentar novamente</Button>
        </div>
      ) : data?.content.length ? (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {data.content.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between gap-3 bg-secondary/50">
                <div>
                  <CardTitle className="text-2xl">Mesa {order.tableNumber ?? order.tableCode ?? "—"}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Comanda #{order.tabId} · Pedido #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{date.format(new Date(order.createdAt))}</p>
                </div>
                <Badge variant={order.delivered ? "default" : "secondary"}>{statusLabels[order.status]}</Badge>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <ul className="space-y-3">
                  {order.items.map((item) => (
                    <li key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <p className="font-medium">{item.quantity}× {item.productName}</p>
                      {item.extras?.length > 0 && <p className="text-sm text-muted-foreground">Adicionais: {item.extras.map((extra) => extra.name).join(", ")}</p>}
                      {item.observation && <p className="text-sm text-muted-foreground">Observação: {item.observation}</p>}
                    </li>
                  ))}
                </ul>
                {order.delivered ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-success">
                    <Check className="size-4" /> Entregue em {order.deliveredAt ? date.format(new Date(order.deliveredAt)) : "data indisponível"}
                  </p>
                ) : (
                  <Button className="w-full" disabled={deliveringId !== null} onClick={() => void markDelivered(order.id)}>
                    {deliveringId === order.id ? <><Loader2 className="mr-2 size-4 animate-spin" /> Salvando...</> : "Marcar como entregue"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">Nenhum pedido encontrado neste filtro.</p>
      )}

      {!loading && !error && data && data.totalElements > 0 && (
        <footer className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 text-sm">
          <span>{data.totalElements} pedido(s) · Página {data.number + 1} de {Math.max(data.totalPages, 1)}</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 0} onClick={() => setPage((value) => value - 1)}>Anterior</Button>
            <Button variant="outline" disabled={page + 1 >= data.totalPages} onClick={() => setPage((value) => value + 1)}>Próxima</Button>
          </div>
        </footer>
      )}
    </main>
  );
};
