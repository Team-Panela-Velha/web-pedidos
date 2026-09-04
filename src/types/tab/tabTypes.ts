export interface StartTabRequest {
  tableCode?: string;
}

export interface TabRequest {
  totalValue?: number;
  tableId?: number;
}

export interface TabResponse {
  id: number;
  totalValue: number;
  closed: boolean;
  tableId: number;
  tableCode: string;
}
