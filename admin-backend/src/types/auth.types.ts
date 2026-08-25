export interface AdminAuthPayload {
  id: string;
  email: string;
  role: 'admin' | 'staff';
}
