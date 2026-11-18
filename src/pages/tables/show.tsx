import { useShow } from "@refinedev/core";

import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const TableShow = () => {
  const { result: record } = useShow({});

  return (
    <ShowView>
      <ShowViewHeader />
      <Card>
        <CardHeader>
          <CardTitle>Mesa {record?.number ?? record?.code}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Número</h4>
              <p className="text-sm text-muted-foreground">
                {record?.number ?? "-"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Código de acesso (tablet)</h4>
              <p className="text-sm text-muted-foreground">
                {record?.code || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};
