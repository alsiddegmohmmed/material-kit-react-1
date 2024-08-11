export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  state?: string;
  city?: string;
  [key: string]: unknown;
}
