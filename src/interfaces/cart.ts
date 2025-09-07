// Shared Cart Item Interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  category: string; // Required field for proper categorization
  notes?: string;
}

