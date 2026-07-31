export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Suspended';
}
