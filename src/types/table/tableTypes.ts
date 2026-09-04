export interface TableRequest {
  code?: string;
}

export interface TableResponse {
  id: number;
  code: string;
}

export interface GenerateCodesResponse {
  loginCode: string;
  logoutCode: string;
}
