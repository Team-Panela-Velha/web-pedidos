import type { ExtraResponse } from "../extra/extraTypes";

export type OrderStatus = "RECEIVED" | "IN_PREPARATION" | "READY" | "DELIVERED";

export interface OrderItemRequest {
  productId?: number;
  orderId?: number;
  quantity?: number;
  observation?: string;
  extraIds?: number[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  orderId: number;
  quantity: number;
  observation: string;
  unitPriceSnapshot: number;
  status: OrderStatus;
  extras: ExtraResponse[];
}
