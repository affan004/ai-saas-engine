export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* You can add a shared Navbar here later */}
      {children}
    </div>
  );
}