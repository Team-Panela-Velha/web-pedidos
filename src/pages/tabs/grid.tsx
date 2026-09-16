import { useNotification, type BaseRecord } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { DataTablePagination } from "@/components/refine-ui/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { kyInstance } from "@/providers/data";

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
  const columns = useMemo(() => [createColumnHelper<Tab>().accessor("id", { header: "ID" })], []);
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

  return (
    <ListView>
      <ListViewHeader />
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Buscar comanda por mesa ou ID"
          placeholder="Buscar por mesa ou ID"
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
                  <CardTitle>Mesa {tab.tableCode || tab.tableId}</CardTitle>
                  <p className="text-sm text-muted-foreground">Comanda #{tab.id}</p>
                </div>
                <Badge variant={tab.closed ? "secondary" : "default"}>{tab.closed ? "Encerrada" : "Aberta"}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-heading text-2xl font-bold">{currency.format(Number(tab.totalValue) || 0)}</p>
                <p className="text-sm text-muted-foreground">Aberta em {tab.openedAt ? date.format(new Date(tab.openedAt)) : "data não disponível"}</p>
              </CardContent>
              {!tab.closed && (
                <CardFooter>
                  <Button variant="outline" disabled={closingId !== null} onClick={() => void closeTab(tab.id)}>
                    {closingId === tab.id ? "Encerrando..." : "Encerrar comanda"}
                  </Button>
                </CardFooter>
              )}
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
    </ListView>
  );
};
