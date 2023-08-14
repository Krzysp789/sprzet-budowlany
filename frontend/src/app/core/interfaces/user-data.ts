export interface UserData {
  id: number,
  name: string,
  email: string,
  customer_id: number | null,
  roles: string[],
}
