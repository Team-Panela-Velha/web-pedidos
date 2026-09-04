import type {
  CategoryRequest,
  CategoryResponse,
} from "@/types/category/categoryTypes";
import { apiService } from "../apiService";

class CategoryService {
  create(request: CategoryRequest): Promise<CategoryResponse> {
    return apiService.post<CategoryResponse, CategoryRequest>(
      "/categories",
      request,
    );
  }

  update(id: number, request: CategoryRequest): Promise<CategoryResponse> {
    return apiService.put<CategoryResponse, CategoryRequest>(
      `/categories/${id}`,
      request,
    );
  }

  getAll(): Promise<CategoryResponse[]> {
    return apiService.get<CategoryResponse[]>("/categories");
  }

  getById(id: number): Promise<CategoryResponse> {
    return apiService.get<CategoryResponse>(`/categories/${id}`);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
