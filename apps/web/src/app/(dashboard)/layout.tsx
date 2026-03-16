/**
 * Layout utama dashboard — shell dengan Sidebar + Topbar.
 *
 * @location apps/web/src/app/(dashboard)/layout.tsx
 * TODO: Tambahkan <Sidebar /> dan <Topbar /> dari components/layout
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* <Sidebar /> */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  )
}
