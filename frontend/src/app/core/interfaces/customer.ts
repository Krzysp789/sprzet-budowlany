import { Address } from './address';

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone_no: string;
  email: string;
  notes: string | null;
  addresses?: Address[]
}
