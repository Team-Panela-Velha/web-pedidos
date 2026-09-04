import type {
  OrderItemRequest,
  OrderItemResponse,
} from "@/types/orderItem/orderItemTypes";
import { apiService } from "../apiService";

class OrderItemService {
  create(request: OrderItemRequest): Promise<OrderItemResponse> {
    return apiService.post<OrderItemResponse, OrderItemRequest>(
      "/order-items",
      request,
    );
  }

  update(id: number, request: OrderItemRequest): Promise<OrderItemResponse> {
    return apiService.put<OrderItemResponse, OrderItemRequest>(
      `/order-items/${id}`,
      request,
    );
  }

  getAll(): Promise<OrderItemResponse[]> {
    return apiService.get<OrderItemResponse[]>("/order-items");
  }

  getById(id: number): Promise<OrderItemResponse> {
    return apiService.get<OrderItemResponse>(`/order-items/${id}`);
  }

  getByOrderId(orderId: number): Promise<OrderItemResponse[]> {
    return apiService.get<OrderItemResponse[]>(
      `/order-items/by-order/${orderId}`,
    );
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/order-items/${id}`);
  }
}

export const orderItemService = new OrderItemService();
