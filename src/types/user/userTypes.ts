export interface UserRequest {
  name?: string;
  email?: string;
  role?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}
