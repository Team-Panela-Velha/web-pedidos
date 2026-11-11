import { useNotification, type BaseRecord } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { useMemo, useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";

import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { DataTablePagination } from "@/components/refine-ui/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { kyInstance } from "@/providers/data";
import { tabService } from "@/services/tab/tabService";
import { orderService } from "@/services/order/orderService";
import type { TabResponse } from "@/types/tab/tabTypes";
import type { OrderResponse } from "@/types/order/orderTypes";

type Tab = BaseRecord & {
  id: number;
  totalValue: number;
  closed: boolean;
  tableId: number;
  tableCode: string;
  openedAt?: string;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export const TabGrid = () => {
  const { open } = useNotification();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [closingId, setClosingId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabResponse | null>(null);
  const [tabOrders, setTabOrders] = useState<OrderResponse[]>([]);
  const columns = useMemo(() => [], []);
  const table = useTable<Tab>({
    columns,
    refineCoreProps: {
      resource: "tabs",
      syncWithLocation: true,
      sorters: { initial: [{ field: "openedAt", order: "desc" }] },
    },
  });
  const { tableQuery, currentPage, setCurrentPage, pageCount, pageSize, setPageSize, setFilters, setSorters } = table.refineCore;

  const applyFilters = (q: string, selectedStatus: string) => {
    setCurrentPage(1);
    setFilters([
      { field: "q", operator: "contains", value: q },
      ...(selectedStatus === "all" ? [] : [{ field: "closed", operator: "eq" as const, value: selectedStatus === "closed" }]),
    ], "replace");
  };

  const closeTab = async (id: number) => {
    if (!window.confirm(`Encerrar a comanda #${id}?`)) return;
    setClosingId(id);
    try {
      const response = await kyInstance.patch(`tabs/${id}/close`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await tableQuery.refetch();
      open?.({ message: "Comanda encerrada", type: "success" });
    } catch (error) {
      open?.({ message: "Erro ao encerrar comanda", description: String(error), type: "error" });
    } finally {
      setClosingId(null);
    }
  };

  const openDetails = async (id: number) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsError(false);
    setSelectedTab(null);
    setTabOrders([]);
    try {
      const [tab, orders] = await Promise.all([
        tabService.getById(id),
        orderService.getTabOrders(id),
      ]);
      setSelectedTab(tab);
      setTabOrders(orders);
    } catch {
      setDetailsError(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <ListView>
      <ListViewHeader />
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Buscar comanda por mesa"
          placeholder="Buscar por mesa"
          value={search}
          onChange={(event) => { setSearch(event.target.value); applyFilters(event.target.value, status); }}
          className="max-w-xs"
        />
        <select
          aria-label="Filtrar comandas por status"
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(event) => { setStatus(event.target.value); applyFilters(search, event.target.value); }}
        >
          <option value="all">Todas</option>
          <option value="open">Abertas</option>
          <option value="closed">Encerradas</option>
        </select>
        <select
          aria-label="Ordenar comandas"
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
          defaultValue="recent"
          onChange={(event) => setSorters(event.target.value === "value"
            ? [{ field: "totalValue", order: "desc" }]
            : [{ field: "openedAt", order: "desc" }])}
        >
          <option value="recent">Mais recentes</option>
          <option value="value">Maior valor</option>
        </select>
      </div>
      {tableQuery.isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin" aria-label="Carregando comandas" /></div>
      ) : tableQuery.isError ? (
        <div className="p-6 text-center">Falha ao carregar comandas. <Button variant="outline" onClick={() => void tableQuery.refetch()}>Tentar novamente</Button></div>
      ) : table.reactTable.getRowModel().rows.length === 0 ? (
        <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">Nenhuma comanda encontrada.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {table.reactTable.getRowModel().rows.map(({ original: tab }) => (
            <Card key={tab.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle>Mesa {tab.tableCode || ""}</CardTitle>
                </div>
                <Badge variant={tab.closed ? "secondary" : "default"}>{tab.closed ? "Encerrada" : "Aberta"}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-heading text-2xl font-bold">{currency.format(Number(tab.totalValue) || 0)}</p>
                <p className="text-sm text-muted-foreground">Aberta em {tab.openedAt ? date.format(new Date(tab.openedAt)) : "data não disponível"}</p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => void openDetails(tab.id)}>
                  <ReceiptText className="mr-2 size-4" /> Ver pedidos
                </Button>
                {!tab.closed && (
                  <Button variant="outline" disabled={closingId !== null} onClick={() => void closeTab(tab.id)}>
                    {closingId === tab.id ? "Encerrando..." : "Encerrar comanda"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {!tableQuery.isLoading && (tableQuery.data?.total ?? 0) > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          pageCount={pageCount}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={tableQuery.data?.total}
        />
      )}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da comanda</DialogTitle>
            <DialogDescription>Pedidos e itens registrados nesta comanda.</DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin" aria-label="Carregando pedidos" /></div>
          ) : detailsError ? (
            <p className="py-4 text-sm text-destructive">Não foi possível carregar os detalhes da comanda.</p>
          ) : selectedTab && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-4">
                <div><p className="font-medium">Mesa {selectedTab.tableCode || ""}</p><p className="text-sm text-muted-foreground">{selectedTab.closed ? "Encerrada" : "Aberta"}</p></div>
                <p className="font-heading text-xl font-bold">{currency.format(Number(selectedTab.totalValue) || 0)}</p>
              </div>
              {tabOrders.length === 0 ? (
                <p className="rounded-xl border p-6 text-center text-sm text-muted-foreground">Esta comanda ainda não possui pedidos.</p>
              ) : tabOrders.map((order) => (
                <section key={order.id} className="space-y-3 rounded-xl border p-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="border-t pt-3 text-sm">
                      <div className="flex justify-between gap-3"><span>{item.quantity}× {item.productName}</span><span>{currency.format((Number(item.unitPriceSnapshot) || 0) * item.quantity)}</span></div>
                      {item.extras?.length > 0 && <p className="mt-1 text-muted-foreground">Adicionais: {item.extras.map((extra) => extra.name).join(", ")}</p>}
                      {item.observation && <p className="mt-1 text-muted-foreground">Observação: {item.observation}</p>}
                      <p className="mt-1 text-xs text-muted-foreground">Status: {item.status.replaceAll("_", " ")}</p>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ListView>
  );
};
