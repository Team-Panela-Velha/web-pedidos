import { useShow } from "@refinedev/core";

import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const ProductShow = () => {
  const { result: record } = useShow({});
  const product = record?.data;

  return (
    <ShowView>
      <ShowViewHeader />
      <Card>
        <CardHeader>
          <CardTitle>{product?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {product?.image && (
              <div className="max-w-xs">
                <AspectRatio ratio={1} className="rounded-md overflow-hidden border bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Nome</h4>
                <p className="text-sm text-muted-foreground">
                  {product?.name || "-"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Preço</h4>
                <p className="text-sm text-muted-foreground">
                  {product?.price != null ? formatCurrency(Number(product.price)) : "-"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Disponível</h4>
                <Badge variant={product?.available ? "default" : "secondary"}>
                  {product?.available ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Descrição</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {product?.description || "-"}
              </p>
            </div>

            {product?.extras && product.extras.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Extras Associados</h4>
                <div className="flex flex-wrap gap-2">
                  {product.extras.map((extra: { id: number; name: string; price: number }) => (
                    <Badge key={extra.id} variant="outline">
                      {extra.name} - {formatCurrency(Number(extra.price))}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};
