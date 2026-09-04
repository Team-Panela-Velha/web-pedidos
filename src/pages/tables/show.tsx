import { useShow } from "@refinedev/core";

import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import {
  Card,
  CardContent,
  CardDescription,
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
          <CardTitle>{record?.data?.code}</CardTitle>
          <CardDescription>ID da Mesa: {record?.data?.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Código</h4>
              <p className="text-sm text-muted-foreground">
                {record?.data?.code || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};
