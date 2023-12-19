import { Sidebar } from "./sidebar";

export default async function DashboardLayout({ children }) {
  return (
    <div className="grid grid-cols-[300px_1fr]">
      <Sidebar />
      {children}
    </div>
  );
}
