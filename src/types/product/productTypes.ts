import type { ExtraResponse } from "../extra/extraTypes";

export interface ProductRequest {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  categoryId?: number;
  available?: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  extras?: ExtraResponse[];
}
