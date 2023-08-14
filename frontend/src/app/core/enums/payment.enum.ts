export enum Payment {
  przy_odbiorze = 1,
  przelew = 2,
}

export const PaymentTable = Object.entries(Payment).filter(
  e => !isNaN(e[0] as any)
).map(e => (
  { name: e[1], id: Number(e[0]), displayName: e[1].toString().replaceAll('_', ' ') }
));

export const PaymentNames = payment();

export function getPaymentValue(value: string): number {
  return <number>Object.entries(Payment).find(([key, val]) => key === value)?.[1];
}

function payment(): string[] {
  const statusNames: string[] = [];
  for (let e in Payment) {
    if (Number(e) >= 0) statusNames.push(Payment[e]);
  }
  return statusNames;
}
