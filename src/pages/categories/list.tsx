import { type BaseRecord } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

type Category = BaseRecord & {
  id: number;
  name: string;
  description: string;
};

export const CategoryList = () => {
  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Category>();

    return [
      columnHelper.accessor("name", {
        id: "name",
        header: "Nome",
        enableSorting: true,
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: "Descrição",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="truncate">{row.original.description}</span>
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
      <DataTable table={table} />
    </ListView>
  );
};
