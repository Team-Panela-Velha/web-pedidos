import type { ExtraRequest, ExtraResponse } from "@/types/extra/extraTypes";
import { apiService } from "../apiService";

class ExtraService {
  create(request: ExtraRequest): Promise<ExtraResponse> {
    return apiService.post<ExtraResponse, ExtraRequest>("/extras", request);
  }

  update(id: number, request: ExtraRequest): Promise<ExtraResponse> {
    return apiService.put<ExtraResponse, ExtraRequest>(`/extras/${id}`, request);
  }

  getAll(): Promise<ExtraResponse[]> {
    return apiService.get<ExtraResponse[]>("/extras");
  }

  getById(id: number): Promise<ExtraResponse> {
    return apiService.get<ExtraResponse>(`/extras/${id}`);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/extras/${id}`);
  }
}

export const extraService = new ExtraService();
