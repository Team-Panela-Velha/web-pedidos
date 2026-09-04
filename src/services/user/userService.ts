import type { UserRequest, UserResponse } from "@/types/user/userTypes";
import { apiService } from "../apiService";

class UserService {
  getAll(): Promise<UserResponse[]> {
    return apiService.get<UserResponse[]>("/users");
  }

  getById(id: number): Promise<UserResponse> {
    return apiService.get<UserResponse>(`/users/${id}`);
  }

  update(id: number, request: UserRequest): Promise<UserResponse> {
    return apiService.put<UserResponse, UserRequest>(`/users/${id}`, request);
  }

  delete(id: number): Promise<void> {
    return apiService.delete<void>(`/users/${id}`);
  }
}

export const userService = new UserService();
