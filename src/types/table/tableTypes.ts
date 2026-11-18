export interface TableRequest {
  number?: number | null;
}

export interface TableResponse {
  id: number;
  code: string;
  number: number | null;
}

export interface GenerateCodesResponse {
  loginCode: string;
  logoutCode: string;
}
