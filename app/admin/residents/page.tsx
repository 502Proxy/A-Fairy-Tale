'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Calendar,
  Home,
  LogOut,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react'; // Menu, X hinzugefügt
import { useSession, signOut } from 'next-auth/react';

// Resident DJ Typ
interface Resident {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
}

export default function ResidentsAdminClient() {
  const { status: authStatus } = useSession();

  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === State für mobile Sidebar ===
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchResidents = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const response = await fetch('/api/residents');
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {}
          throw new Error(errorMsg);
        }
        const data: Resident[] = await response.json();
        setResidents(data);
      } catch (e: any) {
        console.error('Failed to fetch residents:', e);
        setError('Fehler beim Laden der Resident DJs.');
      } finally {
        setIsLoadingData(false);
      }
    };
    if (authStatus === 'authenticated') {
      fetchResidents();
    } else if (authStatus === 'unauthenticated') {
      setIsLoadingData(false);
    }
  }, [authStatus]); // Abhängigkeit vom Auth-Status

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleDeleteResident = async (id: string, name: string) => {
    if (window.confirm(`Möchtest du "${name}" wirklich löschen?`)) {
      try {
        const response = await fetch(`/api/residents/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {}
          throw new Error(errorMsg);
        }
        setResidents((currentResidents) =>
          currentResidents.filter((resident) => resident.id !== id)
        );
        alert(`"${name}" wurde erfolgreich gelöscht.`);
      } catch (err: any) {
        setError(`Fehler beim Löschen von "${name}": ${err.message}`);
        alert(`Fehler beim Löschen von "${name}": ${err.message}`);
      }
    }
  };

  // Schließt die Sidebar bei Navigation auf kleinen Screens
  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }
  // Serverseitiger Schutz wird vorausgesetzt!

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Overlay für mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
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
            className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-white/10 bg-white/5"
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
      <div className="flex-1 md:ml-64 flex flex-col">
        {' '}
        {/* Platz für Sidebar auf md+ */}
        {/* Header für Mobile */}
        <header className="sticky top-0 z-20 bg-slate-900/50 backdrop-blur-md p-4 md:hidden flex items-center justify-between">
          <h1 className="text-lg font-bold">DJs verwalten</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-gray-300 hover:text-white"
            aria-label="Sidebar öffnen"
          >
            <Menu size={24} />
          </button>
        </header>
        {/* Eigentlicher Inhalt */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="mb-6 hidden md:flex items-center justify-between">
            {' '}
            {/* Titel nur auf md+ */}
            <h1 className="text-2xl font-bold">Resident DJs verwalten</h1>
            <Link
              href="/admin/residents/new"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-4 py-2 text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
            >
              <Plus size={18} />
              <span>Neuen DJ hinzufügen</span>
            </Link>
          </div>
          {/* Button "Neu" für Mobile */}
          <div className="mb-6 md:hidden">
            <Link
              href="/admin/residents/new"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-4 py-2 text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
            >
              <Plus size={18} />
              <span>Neuen DJ hinzufügen</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Nach Namen oder Rolle suchen..."
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 rounded-md bg-red-900/50 border border-red-500/30 p-4 text-red-200 flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Residents List */}
          <div className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 md:p-6 backdrop-blur-sm border border-white/10">
            {isLoadingData ? (
              <div className="flex justify-center items-center py-8">
                {' '}
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />{' '}
                <span className="ml-2 text-gray-300">Lade DJs...</span>{' '}
              </div>
            ) : filteredResidents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {residents.length === 0
                  ? 'Noch keine Resident DJs angelegt.'
                  : 'Keine DJs für Suche gefunden.'}
              </div>
            ) : (
              // Grid-Anpassung für Mobile: Standard 1 Spalte, dann mehr
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResidents.map((resident) => (
                  <div
                    key={resident.id}
                    className="rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/10 flex-shrink-0">
                          {' '}
                          {/* flex-shrink-0 hinzugefügt */}
                          <Image
                            src={resident.image || '/placeholder.svg'}
                            alt={resident.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          {' '}
                          {/* Verhindert Überlaufen */}
                          <h3 className="font-semibold truncate">
                            {resident.name}
                          </h3>{' '}
                          {/* truncate hinzugefügt */}
                          <p className="text-sm text-gray-400 truncate">
                            {resident.role}
                          </p>{' '}
                          {/* truncate hinzugefügt */}
                        </div>
                      </div>
                      <p className="mb-4 text-sm text-gray-300 line-clamp-3">
                        {resident.bio || 'Keine Bio vorhanden.'}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-auto pt-2">
                      {' '}
                      {/* Kleiner Abstand nach oben */}
                      <Link
                        href={`/admin/residents/edit/${resident.id}`}
                        title="Bearbeiten"
                        className="rounded-md bg-blue-500/20 p-2 text-blue-400 hover:bg-blue-500/30 transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() =>
                          handleDeleteResident(resident.id, resident.name)
                        }
                        title="Löschen"
                        className="rounded-md bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
