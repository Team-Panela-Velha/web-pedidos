import { useShow } from "@refinedev/core";

import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const ExtraShow = () => {
  const { result: record } = useShow({});

  return (
    <ShowView>
      <ShowViewHeader />
      <Card>
        <CardHeader>
          <CardTitle>{record?.data?.name}</CardTitle>
          <CardDescription>ID do Extra: {record?.data?.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Nome</h4>
              <p className="text-sm text-muted-foreground">
                {record?.data?.name || "-"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Preço</h4>
              <p className="text-sm text-muted-foreground">
                {record?.data?.price != null
                  ? formatCurrency(Number(record.data.price))
                  : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};
