export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TableAuthRequest {
  code: string;
}

export interface TableAuthResponse {
  token: string;
  type: string;
  tableId: number;
  code: string;
  role: string;
}
