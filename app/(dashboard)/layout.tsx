import Sidebar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      {/* pl-56 because above our width of sidebar is 56 */}
      <div className="pl-56 h-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
