export enum Delivery {
  odbiór_osobisty = 1,
  dostawa_na_adres = 2,
}

export const DeliveryTable = Object.entries(Delivery).filter(
  e => !isNaN(e[0] as any)
).map(e => (
  { name: e[1], id: Number(e[0]), displayName: e[1].toString().replaceAll('_', ' ') }
));

export const DeliveryNames = delivery();

export function getDeliveryValue(value: string): number {
  return <number>Object.entries(Delivery).find(([key, val]) => key === value)?.[1];
}

function delivery(): string[] {
  const statusNames: string[] = [];
  for (let e in Delivery) {
    if (Number(e) >= 0) statusNames.push(Delivery[e]);
  }
  return statusNames;
}
