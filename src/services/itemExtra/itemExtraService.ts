import type {
  ItemExtraRequest,
  ItemExtraResponse,
} from "@/types/itemExtra/itemExtraTypes";
import { apiService } from "../apiService";

class ItemExtraService {
  create(request: ItemExtraRequest): Promise<ItemExtraResponse> {
    return apiService.post<ItemExtraResponse, ItemExtraRequest>(
      "/item-extras",
      request,
    );
  }

  getAll(): Promise<ItemExtraResponse[]> {
    return apiService.get<ItemExtraResponse[]>("/item-extras");
  }

  getById(id: number): Promise<ItemExtraResponse> {
    return apiService.get<ItemExtraResponse>(`/item-extras/${id}`);
  }

  getByOrderItemId(orderItemId: number): Promise<ItemExtraResponse[]> {
    return apiService.get<ItemExtraResponse[]>(
      `/item-extras/by-order-item/${orderItemId}`,
    );
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/item-extras/${id}`);
  }
}

export const itemExtraService = new ItemExtraService();
