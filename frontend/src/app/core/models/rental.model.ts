export class RentalModel {
  customer_id: number;
  address_id: number | null;
  date_rental: string;
  date_deadline: string;
  date_return: string | null;
  status: string | number;
  delivery: string | number;
  payment: string | number;
  paid: boolean;
  notes: string | null;
}
