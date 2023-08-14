import { Equipment } from './equipment';

export interface Item {
  id: number,
  serial_number: string,
  status: string | number,
  work_time: number,
  price?: number,
  equipment?: Equipment
}
