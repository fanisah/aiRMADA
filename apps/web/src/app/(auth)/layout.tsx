/**
 * Layout untuk halaman autentikasi (login, dsb.)
 * Tidak menggunakan sidebar/dashboard shell.
 *
 * @location apps/web/src/app/(auth)/layout.tsx
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-gray-50">{children}</div>
}
