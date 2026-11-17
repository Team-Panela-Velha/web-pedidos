import type {
  CreateOrderRequest,
  OrderRequest,
  OrderResponse,
  KitchenOrderPage,
} from "@/types/order/orderTypes";
import { apiService } from "../apiService";

class OrderService {
  create(request: CreateOrderRequest): Promise<OrderResponse> {
    return apiService.post<OrderResponse, CreateOrderRequest>(
      "/orders",
      request,
    );
  }

  getTabOrders(tabId: number): Promise<OrderResponse[]> {
    return apiService.get<OrderResponse[]>(`/orders/tab/${tabId}`);
  }

  getById(id: number): Promise<OrderResponse> {
    return apiService.get<OrderResponse>(`/orders/${id}`);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/orders/${id}`);
  }

  update(id: number, request: OrderRequest): Promise<OrderResponse> {
    return apiService.put<OrderResponse, OrderRequest>(
      `/orders/${id}`,
      request,
    );
  }

  getAll(): Promise<OrderResponse[]> {
    return apiService.get<OrderResponse[]>("/orders");
  }

  getKitchenOrders(delivered: boolean | "all" | undefined, page: number, size: number): Promise<KitchenOrderPage> {
    return apiService.get<KitchenOrderPage>("/orders/kitchen", {
      params: { delivered, page, size },
    });
  }

  markDelivered(id: number): Promise<OrderResponse> {
    return apiService.patch<OrderResponse>(`/orders/${id}/delivered`);
  }
}

export const orderService = new OrderService();
