import type {
  StartTabRequest,
  TabRequest,
  TabResponse,
} from "@/types/tab/tabTypes";
import { apiService } from "../apiService";

class TabService {
  startTab(request: StartTabRequest): Promise<TabResponse> {
    return apiService.post<TabResponse, StartTabRequest>(
      "/tabs/start",
      request,
    );
  }

  closeTab(id: number): Promise<TabResponse> {
    return apiService.patch<TabResponse>(`/tabs/${id}/close`);
  }

  create(request: TabRequest): Promise<TabResponse> {
    return apiService.post<TabResponse, TabRequest>("/tabs", request);
  }

  update(id: number, request: TabRequest): Promise<TabResponse> {
    return apiService.put<TabResponse, TabRequest>(`/tabs/${id}`, request);
  }

  getAll(): Promise<TabResponse[]> {
    return apiService.get<TabResponse[]>("/tabs");
  }

  getById(id: number): Promise<TabResponse> {
    return apiService.get<TabResponse>(`/tabs/${id}`);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/tabs/${id}`);
  }
}

export const tabService = new TabService();
