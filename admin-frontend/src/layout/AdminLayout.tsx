import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopBar />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};
