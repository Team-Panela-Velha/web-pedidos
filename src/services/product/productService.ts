import type {
  ProductRequest,
  ProductResponse,
} from "@/types/product/productTypes";
import { apiService } from "../apiService";

class ProductService {
  create(request: ProductRequest): Promise<ProductResponse> {
    return apiService.post<ProductResponse, ProductRequest>(
      "/products",
      request,
    );
  }

  update(id: number, request: ProductRequest): Promise<ProductResponse> {
    return apiService.put<ProductResponse, ProductRequest>(
      `/products/${id}`,
      request,
    );
  }

  getAll(available?: boolean): Promise<ProductResponse[]> {
    return apiService.get<ProductResponse[]>("/products", {
      params: { available },
    });
  }

  getByCategory(categoryId: number, available?: boolean): Promise<ProductResponse[]> {
    return apiService.get<ProductResponse[]>(
      `/products/category/${categoryId}`,
      {
        params: { available },
      },
    );
  }

  search(keyword?: string, categoryId?: number): Promise<ProductResponse[]> {
    return apiService.get<ProductResponse[]>("/products/search", {
      params: { keyword, categoryId },
    });
  }

  getById(id: number): Promise<ProductResponse> {
    return apiService.get<ProductResponse>(`/products/${id}`);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/products/${id}`);
  }
}

export const productService = new ProductService();
