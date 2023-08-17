import { Item } from './item';

export interface Equipment {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  price: number;
  description: string | null;
  items_count: number;
  available_items_count?: number;
  quantity?: number;
  items?: Item[];
  image_url?: string;
}
