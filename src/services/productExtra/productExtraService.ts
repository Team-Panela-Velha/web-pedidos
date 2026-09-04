import type { ExtraResponse } from "@/types/extra/extraTypes";
import type {
  ProductExtraRequest,
  ProductExtraResponse,
} from "@/types/productExtra/productExtraTypes";
import { apiService } from "../apiService";

class ProductExtraService {
  getProductExtras(productId: number): Promise<ExtraResponse[]> {
    return apiService.get<ExtraResponse[]>(
      `/product-extras/by-product/${productId}/extras`,
    );
  }

  create(request: ProductExtraRequest): Promise<ProductExtraResponse> {
    return apiService.post<ProductExtraResponse, ProductExtraRequest>(
      "/product-extras",
      request,
    );
  }

  getAll(): Promise<ProductExtraResponse[]> {
    return apiService.get<ProductExtraResponse[]>("/product-extras");
  }

  getById(id: number): Promise<ProductExtraResponse> {
    return apiService.get<ProductExtraResponse>(`/product-extras/${id}`);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/product-extras/${id}`);
  }
}

export const productExtraService = new ProductExtraService();
