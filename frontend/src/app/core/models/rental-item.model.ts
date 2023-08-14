export class RentalItemModel {
  equipment_id: number;
  type: string;
  quantity: number;
  item_id: number;
  pivot: { price?: number } = {};
}
