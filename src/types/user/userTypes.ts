export interface UserRequest {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  root?: boolean;
}
