export enum ItemStatus {
  dostępny = 1,
  wypożyczony = 2,
  w_przeglądzie = 3,
}

export const ItemStatusTable = Object.entries(ItemStatus).filter(
  e => !isNaN(e[0] as any)
).map(
  e => (
    { name: e[1], id: Number(e[0]), displayName: e[1].toString().replaceAll('_', ' ') }
  )
);

export const ItemStatusNames = itemStatus();

export function getItemStatusValue(value: string): number {
  return <number>Object.entries(ItemStatus).find(([key, val]) => key === value)?.[1];
}

function itemStatus(): string[] {
  const statusNames: string[] = [];
  for (let e in ItemStatus) {
    if (Number(e) >= 0) statusNames.push(ItemStatus[e]);
  }
  return statusNames;
}
