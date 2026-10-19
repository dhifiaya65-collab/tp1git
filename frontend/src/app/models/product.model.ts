export interface Product {
  id?: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export const CATEGORIES = ['Laptop', 'PC Bureau', 'Composants', 'Accessoires', 'Écrans', 'Réseau'];
