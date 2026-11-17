import type { OrderItemRequest, OrderItemResponse, OrderStatus } from "../orderItem/orderItemTypes";

export interface CreateOrderRequest {
  tabId?: number;
  items?: OrderItemRequest[];
}

export interface OrderRequest {
  tabId?: number;
}

export interface OrderResponse {
  id: number;
  tabId: number;
  items: OrderItemResponse[];
  createdAt: string;
  delivered: boolean;
  deliveredAt: string | null;
  tableCode: string | null;
  tabClosed: boolean | null;
  status: OrderStatus;
}

export interface KitchenOrderPage {
  content: OrderResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
