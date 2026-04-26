'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Truck,
  Users,
  Package,
  MapPin,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react'
import { Route } from 'next'
import { DUMMY_USERS, type DummyUser, type User } from '@/types'

// ─── Tipe ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string
  href: Route
  icon: React.ReactNode
}

// ─── Data navigasi ────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/overview', icon: <LayoutDashboard size={18} /> },
  { label: 'Fleet', href: '/fleet', icon: <Truck size={18} /> },
  { label: 'Personnel', href: '/drivers', icon: <Users size={18} /> },
  { label: 'Logistics', href: '/shipments', icon: <Package size={18} /> },
  { label: 'Live Routes', href: '/routes', icon: <MapPin size={18} /> },
]

// ─── Dummy user — ganti dengan data dari Supabase Auth ───────────────────────
// TODO: Fetch dari GET /api/auth/me dan ganti nilai di bawah ini
const DUMMY_USER = {
  initials: 'AN',
  full_name: 'Andi Wijaya',
  role: 'Manager',
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────
function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
        'group transition-all duration-150',
        active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white',
      ].join(' ')}
    >
      <span
        className={[
          'shrink-0 transition-colors duration-150',
          active ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300',
        ].join(' ')}
      >
        {item.icon}
      </span>
      {item.label}
      {active && <ChevronRight size={14} className="ml-auto text-orange-400" />}
    </Link>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col',
          'border-r border-white/5 bg-[#0f172a]',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:relative lg:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/5 px-4">
          {/* TODO: Ganti <div> ini dengan <Image> dari /public/icons/logo.png */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30">
            <Truck size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-wide text-white">aiRMADA</p>
            <p className="text-[10px] leading-tight text-slate-500">Fleet Management System</p>
          </div>
          {/* Close button mobile */}
          <button
            onClick={onClose}
            className="ml-auto text-slate-500 transition-colors hover:text-white lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
              onClick={() => {
                if (window.innerWidth < 1024) onClose()
              }}
            />
          ))}
        </nav>

        {/* User + Logout */}
        <div className="space-y-1 border-t border-white/5 px-3 pt-4 pb-4">
          <div className="flex items-center gap-3 px-3 py-2">
            {/* TODO: Ganti <div> ini dengan <Image> dari avatar_url user */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-xs font-bold text-white shadow-md">
              {DUMMY_USER.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{DUMMY_USER.full_name}</p>
              <p className="text-[10px] text-slate-500">{DUMMY_USER.role}</p>
            </div>
          </div>
          <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-150 hover:bg-white/5 hover:text-red-400">
            <LogOut size={16} className="shrink-0 transition-colors group-hover:text-red-400" />
            {/* TODO: Hubungkan onClick ini ke supabase.auth.signOut() */}
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ onMenuClick, pageTitle }: { onMenuClick: () => void; pageTitle: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-semibold text-slate-700 lg:hidden">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* TODO: Hubungkan ke useNotificationStore dan tampilkan unread_count */}
        <button className="relative rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500" />
        </button>
        {/* TODO: Ganti dengan data user dari auth */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">
          {DUMMY_USER.initials}
        </div>
      </div>
    </header>
  )
}

// ─── Layout utama ─────────────────────────────────────────────────────────────

/**
 * Layout utama dashboard — shell dengan Sidebar + Topbar.
 *
 * @location apps/web/src/app/(dashboard)/layout.tsx
 * TODO: Tambahkan <Sidebar /> dan <Topbar /> dari components/layout
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Tutup sidebar saat navigasi (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Tutup sidebar saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentPage = navItems.find((item) => pathname.startsWith(item.href))
  const pageTitle = currentPage?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten utama */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
