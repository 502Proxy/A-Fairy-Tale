// Datei: components/admin/AdminLayout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  Calendar,
  BarChart3,
} from 'lucide-react';

/**
 * Props für das AdminLayout.
 * @param children - Der spezifische Inhalt der Admin-Seite.
 * @param pageTitle - Der Titel, der auf der Seite (und im mobilen Header) angezeigt wird.
 */
interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export default function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
  const { status } = useSession(); // Nur Status für Logout-Button benötigt
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`
         fixed inset-y-0 left-0 z-40
         w-64 bg-slate-800/80 p-4 backdrop-blur-lg
         flex flex-col transition-transform duration-300 ease-in-out
         md:static md:translate-x-0 md:bg-slate-800/50 md:backdrop-blur-sm
         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            A Fairy Tale Admin
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-white"
            aria-label="Sidebar schließen"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2 flex-grow">
          <Link
            href="/admin"
            onClick={handleLinkClick}
            className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10"
          >
            <BarChart3 size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/residents"
            onClick={handleLinkClick}
            className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10"
          >
            <Users size={18} />
            <span>Resident DJs</span>
          </Link>
          <Link
            href="/admin/events"
            onClick={handleLinkClick}
            className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10"
          >
            <Calendar size={18} />
            <span>Events</span>
          </Link>
        </nav>
        <div className="mt-auto space-y-2">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10"
          >
            <Home size={18} />
            <span>Zur Website</span>
          </Link>
          {status === 'authenticated' && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10 text-red-400"
            >
              <LogOut size={18} />
              <span>Abmelden</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="sticky top-0 z-20 bg-slate-900/50 backdrop-blur-md p-4 md:hidden flex items-center justify-between">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-gray-300 hover:text-white"
            aria-label="Sidebar öffnen"
          >
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
