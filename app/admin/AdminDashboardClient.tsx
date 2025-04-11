'use client';

import Link from 'next/link';
import {
  Users,
  Calendar,
  Home,
  LogOut,
  BarChart3,
  Loader2,
  AlertCircle,
  X,
  Menu,
} from 'lucide-react'; // Nötige Icons
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface StatsData {
  residentCount: number;
  upcomingEventCount: number;
  pastEventCount: number;
}

export default function AdminDashboardClient() {
  const { data: session, status: authStatus } = useSession();

  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // === State für mobile Sidebar ===
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      // ... (Fetch-Logik bleibt gleich) ...
      setIsLoadingStats(true);
      setStatsError(null);
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (jsonError: any) {
            throw new Error(jsonError.message);
          }
          throw new Error(errorMsg);
        }
        const data: StatsData = await response.json();
        setStatsData(data);
      } catch (err: any) {
        setStatsError(`Fehler beim Laden der Statistiken: ${err.message}`);
      } finally {
        setIsLoadingStats(false);
      }
    };
    if (authStatus === 'authenticated') {
      fetchStats();
    } else if (authStatus === 'unauthenticated') {
      setIsLoadingStats(false);
    }
  }, [authStatus]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Schließt die Sidebar bei Navigation auf kleinen Screens
  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  const statsStructure = [
    { name: 'Resident DJs', key: 'residentCount', icon: Users },
    { name: 'Kommende Events', key: 'upcomingEventCount', icon: Calendar },
    { name: 'Vergangene Events', key: 'pastEventCount', icon: Calendar },
    { name: 'Events Gesamt', key: 'totalEventCount', icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br mx-auto   from-slate-900 to-slate-800 text-white">
      {/* Overlay für mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      {/* Passt Klassen für mobile Ansicht an: fixed, volle Höhe, z-index, transform */}
      <div
        className={`
            fixed inset-y-0 left-0 z-40
            bg-slate-800/80 p-4 backdrop-blur-lg mx-auto max-w-3xl
            flex flex-col transition-transform duration-300 ease-in-out
            md:static md:translate-x-0 md:bg-slate-800/50 md:backdrop-blur-sm
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
         `}
      >
        <div className="mb-8 flex items-center justify-between">
          {' '}
          {/* Justify-between für Schließen-Button */}
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            A Fairy Tale Admin
          </h1>
          {/* Schließen-Button für mobile Sidebar */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-white"
            aria-label="Sidebar schließen"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2 flex-grow">
          {/* Links rufen jetzt handleLinkClick auf */}
          <Link
            href="/admin"
            onClick={handleLinkClick}
            className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10 bg-white/5"
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
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10 text-red-400"
          >
            <LogOut size={18} />
            <span>Abmelden</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {/* Passt Padding an und fügt oberen Platz für mobilen Header hinzu */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {' '}
        {/* ml-64 auf md+ Screens, um Platz für Sidebar zu machen */}
        {/* Header für mobilen Menü-Button */}
        <header className="sticky top-0 z-20 bg-slate-900/50 backdrop-blur-md p-4 md:hidden flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-gray-300 hover:text-white"
            aria-label="Sidebar öffnen"
          >
            <Menu size={24} />
          </button>
        </header>
        {/* Eigentlicher Inhalt mit Padding */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Titel nur auf größeren Screens, da im mobilen Header */}
          <h1 className="hidden md:block mb-6 text-2xl font-bold">Dashboard</h1>
          <p className="mb-4 text-gray-300">
            Angemeldet als: {session?.user?.email} (Rolle: {session?.user?.role}
            )
          </p>

          {/* Stats Section */}
          <div className="mb-8">
            {statsError && (
              <div className="mb-4 rounded-md bg-red-900/50 border border-red-500/30 p-4 text-red-200 flex items-center gap-2">
                {' '}
                <AlertCircle size={18} /> <span>{statsError}</span>{' '}
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {isLoadingStats ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 backdrop-blur-sm border border-white/10 animate-pulse h-[108px]"
                  >
                    {' '}
                    <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>{' '}
                    <div className="h-8 bg-slate-600 rounded w-1/2"></div>{' '}
                  </div>
                ))
              ) : statsData ? (
                statsStructure.map((stat) => (
                  <div
                    key={stat.name}
                    className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 backdrop-blur-sm border border-white/10"
                  >
                    {' '}
                    <div className="flex items-center">
                      {' '}
                      <div className="rounded-full bg-purple-500/20 p-3">
                        {' '}
                        <stat.icon size={24} className="text-purple-400" />{' '}
                      </div>{' '}
                      <div className="ml-4">
                        {' '}
                        <p className="text-sm text-gray-400">
                          {stat.name}
                        </p>{' '}
                        <p className="text-2xl font-semibold">
                          {' '}
                          {statsData[stat.key as keyof StatsData] ?? '-'}{' '}
                        </p>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-4">
                  Statistiken konnten nicht geladen werden.
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity (Immer noch statisch) */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Letzte Aktivitäten</h2>
            <div className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 backdrop-blur-sm border border-white/10">
              <ul className="space-y-4">
                <li className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <p className="font-medium">Neues Event erstellt</p>
                    <p className="text-sm text-gray-400">
                      A Fairy Tale - Summer Edition
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">Vor 2 Stunden</span>
                </li>
                {/* Weitere statische Einträge */}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Schnellzugriff</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/admin/residents"
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-pink-500/30 to-purple-500/30 p-4 transition-all hover:from-pink-500/40 hover:to-purple-500/40"
              >
                <Users size={20} /> <span>DJs verwalten</span>
              </Link>
              <Link
                href="/admin/events"
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500/30 to-blue-500/30 p-4 transition-all hover:from-purple-500/40 hover:to-blue-500/40"
              >
                <Calendar size={20} /> <span>Events verwalten</span>
              </Link>
              {/* Weitere Quick Actions */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
