import type { OrderItemRequest, OrderItemResponse } from "../orderItem/orderItemTypes";

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
}
