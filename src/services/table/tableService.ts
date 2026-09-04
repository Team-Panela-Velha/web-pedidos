import type {
  GenerateCodesResponse,
  TableRequest,
  TableResponse,
} from "@/types/table/tableTypes";
import { apiService } from "../apiService";

class TableService {
  create(request: TableRequest): Promise<TableResponse> {
    return apiService.post<TableResponse, TableRequest>("/tables", request);
  }

  update(id: number, request: TableRequest): Promise<TableResponse> {
    return apiService.put<TableResponse, TableRequest>(
      `/tables/${id}`,
      request,
    );
  }

  getAll(): Promise<TableResponse[]> {
    return apiService.get<TableResponse[]>("/tables");
  }

  getById(id: number): Promise<TableResponse> {
    return apiService.get<TableResponse>(`/tables/${id}`);
  }

  getByCode(code: string): Promise<TableResponse> {
    return apiService.get<TableResponse>(`/tables/code/${code}`);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/tables/${id}`);
  }

  generateCodes(id: number): Promise<GenerateCodesResponse> {
    return apiService.post<GenerateCodesResponse>(
      `/tables/${id}/generate-codes`,
    );
  }
}

export const tableService = new TableService();
