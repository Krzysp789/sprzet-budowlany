export enum RentStatus {
  oczekujący = 1,
  zatwierdzony = 2,
  w_trakcie = 3,
  zakończony = 4,
}

export const RentalStatusTable = Object.entries(RentStatus).filter(
  e => !isNaN(e[0] as any)
).map(e => (
  { name: e[1], id: Number(e[0]), displayName: e[1].toString().replaceAll('_', ' ') }
));

export const RentalStatusNames = rentalStatus();

export function getRentStatusValue(value: string): number {
  return <number>Object.entries(RentStatus).find(([key, val]) => key === value)?.[1];
}

function rentalStatus(): string[] {
  const statusNames: string[] = [];
  for (let e in RentStatus) {
    if (Number(e) >= 0) statusNames.push(RentStatus[e]);
  }
  return statusNames;
}
