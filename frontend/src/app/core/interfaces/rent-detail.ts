import { Equipment } from './equipment';

export interface RentDetail {
  dateDeadline: string;
  dateRental: string;
  delivery: number;
  payment: number;
  address_id?: number;
  equipment: Equipment[];
}
