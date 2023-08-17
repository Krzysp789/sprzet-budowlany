import { Address } from './address';
import { Item } from './item';

export interface Rental {
  id: number;
  customer_id: number;
  customer_first_name: string;
  customer_last_name: string;
  address_id: number | null;
  address?: Address | null;
  total_price?: number;
  date_rental: string;
  date_deadline: string;
  date_return: string | null;
  status: string | number;
  delivery: string | number;
  payment: string | number;
  paid: boolean;
  notes: string | null;
  items_count?: number;
  items?: Item[];
  equipment?: RentalEquipment[];
}

interface RentalEquipment {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}
