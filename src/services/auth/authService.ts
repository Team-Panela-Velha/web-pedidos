import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  TableAuthRequest,
  TableAuthResponse,
} from "@/types/auth/authTypes";
import type { UserResponse } from "@/types/user/userTypes";
import { apiService } from "../apiService";

class AuthService {
  register(request: RegisterRequest): Promise<UserResponse> {
    return apiService.post<UserResponse, RegisterRequest>(
      "/auth/register",
      request,
    );
  }

  login(request: LoginRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse, LoginRequest>(
      "/auth/login",
      request,
    );
  }

  logout(): Promise<void> {
    return apiService.post<void>("/auth/logout");
  }

  tableAuth(request: TableAuthRequest): Promise<TableAuthResponse> {
    return apiService.post<TableAuthResponse, TableAuthRequest>(
      "/tables/auth",
      request,
    );
  }

  tableLogout(): Promise<void> {
    return apiService.put<void>("/tables/logout");
  }
}

export const authService = new AuthService();
