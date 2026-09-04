export interface ProductExtraRequest {
  productId?: number;
  extraId?: number;
}

export interface ProductExtraResponse {
  id: number;
  productId: number;
  extraId: number;
}
