export interface ItemExtraRequest {
  orderItemId?: number;
  extraId?: number;
}

export interface ItemExtraResponse {
  id: number;
  orderItemId: number;
  extraId: number;
}
