// ============================================================
// TELA EM GRID DE CARDS (COMENTADA PARA USO FUTURO)
// Para reativar: descomente o bloco abaixo e comente a listagem
// padrão (TabGrid no fim do arquivo).
// ============================================================
//
// import { useList, useNotification, BaseRecord } from "@refinedev/core";
// import { useCallback, useState } from "react";
// import { CheckCircle2, Clock, XCircle, Receipt, Loader2 } from "lucide-react";
//
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { kyInstance } from "@/providers/data";
//
// type TabResponse = BaseRecord & {
//   id: number;
//   totalValue: number;
//   closed: boolean;
//   tableId: number;
//   tableCode: string;
// };
//
// const formatCurrency = (value: number) =>
//   new Intl.NumberFormat("pt-BR", {
//     style: "currency",
//     currency: "BRL",
//   }).format(Number(value) || 0);
//
// export const TabGrid = () => {
//   const { open } = useNotification();
//
//   const { data, isLoading, refetch } = useList<TabResponse>({
//     resource: "tabs",
//     meta: {
//       headers: {
//         Accept: "application/json",
//       },
//     },
//   });
//
//   const tabs = data?.data || [];
//
//   const [pendingId, setPendingId] = useState<number | null>(null);
//   const [closingId, setClosingId] = useState<number | null>(null);
//   const isClosing = closingId !== null;
//
//   const handleCloseTab = useCallback(
//     async (id: number) => {
//       setClosingId(id);
//       try {
//         const response = await kyInstance.patch(`tabs/${id}/close`);
//         await response.json();
//         open?.({
//           message: "Comanda encerrada",
//           description: `A comanda #${id} foi encerrada com sucesso.`,
//           type: "success",
//         });
//         setPendingId(null);
//         refetch();
//       } catch (error) {
//         open?.({
//           message: "Erro ao encerrar comanda",
//           description:
//             (error as { message?: string })?.message ||
//             `Não foi possível encerrar a comanda #${id}.`,
//           type: "error",
//         });
//       } finally {
//         setClosingId(null);
//       }
//     },
//     [open, refetch],
//   );
//
//   const tabsOpen = tabs.filter((t) => !t.closed);
//   const tabsClosed = tabs.filter((t) => t.closed);
//
//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">Comandas</h1>
//           <p className="text-sm text-muted-foreground">
//             Visualização em cards. Encerre as comandas abertas quando fecharem a conta.
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Badge variant="default" className="gap-1">
//             <Clock className="h-3 w-3" /> {tabsOpen.length} abertas
//           </Badge>
//           <Badge variant="secondary" className="gap-1">
//             <CheckCircle2 className="h-3 w-3" /> {tabsClosed.length} encerradas
//           </Badge>
//         </div>
//       </div>
//
//       {isLoading ? (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Card key={i}>
//               <CardHeader>
//                 <Skeleton className="h-5 w-1/2" />
//                 <Skeleton className="h-4 w-2/3" />
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <Skeleton className="h-8 w-2/3" />
//                 <Skeleton className="h-4 w-1/2" />
//               </CardContent>
//               <CardFooter>
//                 <Skeleton className="h-9 w-full" />
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       ) : tabs.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
//             <Receipt className="h-10 w-10 text-muted-foreground" />
//             <p className="font-medium">Nenhuma comanda encontrada</p>
//             <p className="text-sm text-muted-foreground">
//               As comandas aparecem aqui quando forem abertas nas mesas.
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {tabs.map((tab) => {
//             const isThisClosing = closingId === tab.id;
//             return (
//               <Card
//                 key={tab.id}
//                 className={
//                   tab.closed
//                     ? "opacity-80"
//                     : "border-l-4 border-l-green-500 shadow-md"
//                 }
//               >
//                 <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
//                   <div className="space-y-1">
//                     <CardTitle className="flex items-center gap-2 text-lg">
//                       <Receipt className="h-5 w-5 text-muted-foreground" />
//                       {tab.tableCode || `#${tab.id}`}
//                     </CardTitle>
//                     <p className="text-xs text-muted-foreground">
//                       Comanda #{tab.id}
//                       {tab.tableId ? ` · Mesa ID ${tab.tableId}` : ""}
//                     </p>
//                   </div>
//                   {tab.closed ? (
//                     <Badge variant="outline" className="gap-1">
//                       <CheckCircle2 className="h-3 w-3" /> Encerrada
//                     </Badge>
//                   ) : (
//                     <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
//                       <Clock className="h-3 w-3" /> Aberta
//                     </Badge>
//                   )}
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">
//                       Total
//                     </p>
//                     <p className="text-2xl font-bold">
//                       {formatCurrency(tab.totalValue)}
//                     </p>
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   {!tab.closed ? (
//                     <Button
//                       variant="destructive"
//                       className="w-full gap-2"
//                       onClick={() => setPendingId(tab.id)}
//                       disabled={isClosing}
//                     >
//                       {isThisClosing ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <XCircle className="h-4 w-4" />
//                       )}
//                       {isThisClosing ? "Encerrando..." : "Encerrar comanda"}
//                     </Button>
//                   ) : (
//                     <Button variant="secondary" className="w-full" disabled>
//                       Já encerrada
//                     </Button>
//                   )}
//                 </CardFooter>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//
//       <AlertDialog
//         open={pendingId !== null}
//         onOpenChange={(openState) => {
//           if (!openState && !isClosing) setPendingId(null);
//         }}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               Encerrar comanda #{pendingId ?? ""}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Tem certeza que deseja encerrar esta comanda? Depois de encerrada,
//               ela será marcada como fechada e não poderá receber mais pedidos.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               onClick={() => setPendingId(null)}
//               disabled={isClosing}
//             >
//               Cancelar
//             </AlertDialogCancel>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 if (pendingId != null) void handleCloseTab(pendingId);
//               }}
//               disabled={isClosing}
//             >
//               {isClosing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Encerrando...
//                 </>
//               ) : (
//                 "Sim, encerrar"
//               )}
//             </Button>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };
//
// ============================================================
// FIM DA VERSÃO EM GRID — abaixo está a listagem padrão ativa
// ============================================================

import { type BaseRecord, useNotification } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useCallback, useState } from "react";
import { XCircle, Loader2 } from "lucide-react";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { kyInstance } from "@/providers/data";

type Tab = BaseRecord & {
  id: number;
  totalValue: number;
  closed: boolean;
  tableId: number;
  tableCode: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);

export const TabGrid = () => {
  const { open } = useNotification();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [closingId, setClosingId] = useState<number | null>(null);
  const isClosing = closingId !== null;

  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Tab>();

    return [
      columnHelper.accessor("id", {
        id: "id",
        header: "ID",
        enableSorting: false,
      }),
      columnHelper.accessor("tableCode", {
        id: "tableCode",
        header: "Mesa",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.tableCode || `—`}
          </span>
        ),
      }),
      columnHelper.accessor("totalValue", {
        id: "totalValue",
        header: "Total",
        enableSorting: true,
        cell: ({ row }) => formatCurrency(row.original.totalValue),
      }),
      columnHelper.accessor("closed", {
        id: "closed",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.closed ? (
            <Badge variant="outline">Encerrada</Badge>
          ) : (
            <Badge
              variant="default"
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              Aberta
            </Badge>
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const isThisClosing = closingId === row.original.id;
          return (
            <div className="flex gap-2">
              {!row.original.closed && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => setPendingId(row.original.id)}
                  disabled={isClosing}
                >
                  {isThisClosing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {isThisClosing ? "Encerrando" : "Encerrar"}
                </Button>
              )}
              <EditButton recordItemId={row.original.id} size="sm" />
              <ShowButton recordItemId={row.original.id} size="sm" />
              <DeleteButton recordItemId={row.original.id} size="sm" />
            </div>
          );
        },
        enableSorting: false,
        size: 420,
      }),
    ];
  }, [closingId, isClosing]);

  const table = useTable<Tab>({
    columns,
    refineCoreProps: {
      resource: "tabs",
      syncWithLocation: true,
    },
  });

  const handleCloseTab = useCallback(
    async (id: number) => {
      setClosingId(id);
      try {
        const response = await kyInstance.patch(`tabs/${id}/close`);
        await response.json();
        open?.({
          message: "Comanda encerrada",
          description: `A comanda #${id} foi encerrada com sucesso.`,
          type: "success",
        });
        setPendingId(null);
        table.refineCore.tableQuery.refetch();
      } catch (error) {
        open?.({
          message: "Erro ao encerrar comanda",
          description:
            (error as { message?: string })?.message ||
            `Não foi possível encerrar a comanda #${id}.`,
          type: "error",
        });
      } finally {
        setClosingId(null);
      }
    },
    [open, table.refineCore],
  );

  return (
    <>
      <ListView>
        <ListViewHeader />
        <DataTable table={table} />
      </ListView>

      <AlertDialog
        open={pendingId !== null}
        onOpenChange={(openState) => {
          if (!openState && !isClosing) setPendingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Encerrar comanda #{pendingId ?? ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja encerrar esta comanda? Depois de encerrada,
              ela será marcada como fechada e não poderá receber mais pedidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPendingId(null)}
              disabled={isClosing}
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingId != null) void handleCloseTab(pendingId);
              }}
              disabled={isClosing}
            >
              {isClosing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Encerrando...
                </>
              ) : (
                "Sim, encerrar"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
