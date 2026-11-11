import { type BaseRecord } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Product = BaseRecord & {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  available: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const ProductList = () => {
  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Product>();

    return [
      columnHelper.accessor("image", {
        id: "image",
        header: "Imagem",
        enableSorting: false,
        size: 100,
        cell: ({ row }) => (
          <AspectRatio ratio={1} className="w-12 rounded-md overflow-hidden bg-muted">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                Sem img
              </div>
            )}
          </AspectRatio>
        ),
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: "Nome",
        enableSorting: true,
      }),
      columnHelper.accessor("price", {
        id: "price",
        header: "Preço",
        enableSorting: true,
        cell: ({ row }) => formatCurrency(Number(row.original.price) || 0),
      }),
      columnHelper.accessor("available", {
        id: "available",
        header: "Disponível",
        enableSorting: false,
        size: 120,
        cell: ({ row }) => (
          <Badge variant={row.original.available ? "default" : "secondary"}>
            {row.original.available ? "Sim" : "Não"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <EditButton recordItemId={row.original.id} size="sm" />
            <ShowButton recordItemId={row.original.id} size="sm" />
            <DeleteButton recordItemId={row.original.id} size="sm" />
          </div>
        ),
        enableSorting: false,
        size: 290,
      }),
    ];
  }, []);

  const table = useTable({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
    },
  });

  return (
    <ListView>
      <ListViewHeader />
      <select
        aria-label="Filtrar produtos por disponibilidade"
        className="h-10 w-fit rounded-xl border border-input bg-background px-3 text-sm"
        defaultValue="all"
        onChange={(event) => {
          table.refineCore.setCurrentPage(1);
          table.refineCore.setFilters([
            { field: "available", operator: "eq", value: event.target.value === "all" ? undefined : event.target.value === "available" },
          ], "merge");
        }}
      >
        <option value="all">Todos os produtos</option>
        <option value="available">Disponíveis</option>
        <option value="unavailable">Indisponíveis</option>
      </select>
      <DataTable table={table} />
    </ListView>
  );
};
